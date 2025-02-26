import React, { useEffect, useState } from 'react';
import { Calendar, Modal, Badge, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';


const moodColors: Record<string, "success" | "processing" | "warning" | "error" | "default" | undefined> = {
    cheerful: "success",
    inspiring: "processing",
    happy: "success",
    sad: "error",
    neutral: "default",
    anxious: "warning"
};

const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [diaryData, setDiaryData] = useState<any[]>([]);
    const [entriesByDate, setEntriesByDate] = useState<Record<string, any[]>>({});

    const validRange: [Dayjs, Dayjs] = [dayjs().subtract(30, 'day'), dayjs()];

    // 🔹 Fetch diary entries from API
    const getDiaryEntries = async () => {
        try {
            const response = await fetch('/api/mongo/getAllEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            if (data.success) {
                setDiaryData(data.data);

                const groupedEntries: Record<string, any[]> = {};
                data.data.forEach((entry: any) => {
                    const dateKey = dayjs(entry.entryDate).format('YYYY-MM-DD');
                    if (!groupedEntries[dateKey]) {
                        groupedEntries[dateKey] = [];
                    }
                    groupedEntries[dateKey].push(entry);
                });

                setEntriesByDate(groupedEntries);
            } else {
                console.error('Error fetching diary');
            }
        } catch (error) {
            console.error('Error fetching diary:', error);
        }
    };

    // 🔹 Open modal and show diary details for selected date
    const onSelectDate = (date: Dayjs) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

    const dateCellRender = (date: Dayjs) => {
        const dateKey = date.format('YYYY-MM-DD');
        const entry = entriesByDate[dateKey]?.[0]; // Get the first entry for this date

        return entry ? (
            <div
                style={{
                    padding: '5px',
                    textAlign: 'left',
                    overflow: 'hidden', // Prevents scrollbars
                    whiteSpace: 'nowrap', // Ensures text remains inline
                    textOverflow: 'ellipsis', // Adds ellipsis for overflow text
                    maxHeight: '80px', // Prevents excessive height
                    borderRadius: '6px', // Rounded corners for better look
                    background: '#f6f8fc' // Light greyish background for better visibility
                }}
            >
                {/* Mood Badge */}
                <Badge status={moodColors[entry.mood] || "default"} text={<strong>{entry.mood}</strong>} />

                {/* Summary (Show only first 2 lines) */}
                <ul style={{ margin: '6px 0 0', paddingLeft: '10px', fontSize: '12px', lineHeight: '1.4' }}>
                    {entry.summary.slice(0, 2).map((text: string, idx: number) => (
                        <Tooltip key={idx} title={text.slice(0, 35) + "..."} color="#108ee9">
                            <li
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: '500',
                                    color: '#3b5998',
                                    cursor: 'pointer'
                                }}
                            >
                                🔹 {text} {/* Adds a bullet-style emoji for aesthetics */}
                            </li>
                        </Tooltip>
                    ))}
                    {entry.summary.length > 2 && (
                        <Tooltip title={entry.summary.length - 2 + " more"}>
                            <li style={{ color: '#3b5998', fontWeight: '500', cursor: 'pointer' }}>
                                ... more
                            </li>
                        </Tooltip>
                    )}
                </ul>
            </div>
        ) : null;
    };



    useEffect(() => {
        getDiaryEntries();
    }, []);

    return (
        <div className="w-full">
            <Calendar onSelect={onSelectDate} validRange={validRange} cellRender={dateCellRender} />

            <Modal
                title="Diary Entries"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {selectedDate && (
                    <div>
                        <h3>{selectedDate.format('YYYY-MM-DD')}</h3>
                        {entriesByDate[selectedDate.format('YYYY-MM-DD')]?.length > 0 ? (
                            <ul>
                                {entriesByDate[selectedDate.format('YYYY-MM-DD')].map((entry, index) => (
                                    <li key={index}>
                                        <p><strong>Mood:</strong> {entry.mood}</p>
                                        <p><strong>Summary:</strong></p>
                                        <ul>
                                            {entry.summary.map((text: string, idx: number) => (
                                                <li key={idx}>{text}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No diary entry for this date.</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HomePage;
