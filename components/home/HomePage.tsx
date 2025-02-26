import React, { useEffect, useState } from 'react';
import { Calendar, Modal, Badge, Tooltip, Form, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import TextArea from 'antd/es/input/TextArea';


const moodColors: Record<string, "success" | "processing" | "warning" | "error" | "default" | undefined> = {
    cheerful: "success",
    inspiring: "processing",
    happy: "success",
    sad: "error",
    neutral: "default",
    anxious: "warning"
};

const moodOptions = Object.keys(moodColors);

const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [dateId, setDateId] = useState<string | null>(null);
    const [diaryData, setDiaryData] = useState<any[]>([]);
    const [entriesByDate, setEntriesByDate] = useState<Record<string, any[]>>({});
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const validRange: [Dayjs, Dayjs] = [dayjs().subtract(30, 'day'), dayjs()];
    let token: string | null = null;

    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
    }

    // 🔹 Fetch diary entries from API
    const getDiaryEntries = async () => {
        try {
            const response = await fetch('/api/mongo/getAllEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
        const entry = entriesByDate[date.format('YYYY-MM-DD')];
        setDateId(entry ? entry[0]._id : null);
        form.setFieldsValue({
            mood: entry ? entry[0].mood : undefined,
            summary: entry ? entry[0].summary.join('\n') : '',
            id: entry ? entry[0]._id : undefined
        });
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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            console.log('Received values:', values);
            const formattedEntry = {
                entryDate: selectedDate?.format('YYYY-MM-DD'),
                mood: values.mood,
                summary: values.summary.split('\n'),
                _id: dateId
            };

            const method = selectedDate && entriesByDate[selectedDate.format('YYYY-MM-DD')] ? 'PUT' : 'POST';
            const endpoint = method === 'PUT' ? '/api/mongo/updateDailyEntry' : '/api/mongo/addDailyEntry';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formattedEntry),
            });

            const result = await response.json();
            if (result.success) {
                getDiaryEntries(); // Refresh the calendar
                setIsModalOpen(false);
            } else {
                console.error('Error saving diary entry');
            }
        } catch (error) {
            console.error('Validation error:', error);
        }
        setLoading(false);
    };


    useEffect(() => {
        getDiaryEntries();
    }, []);

    return (
        <div className="w-full">
            <Calendar onSelect={onSelectDate} validRange={validRange} cellRender={dateCellRender} />
            <Modal
                title={selectedDate ? `Diary Entry for ${selectedDate.format('YYYY-MM-DD')}` : 'Diary Entry'}
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText={selectedDate && entriesByDate[selectedDate.format('YYYY-MM-DD')] ? 'Update' : 'Add'}
            >
                <Form form={form} layout="vertical">
                    {/* Mood Selection */}
                    <Form.Item name="mood" label="Mood" rules={[{ required: true, message: 'Please select a mood' }]}>
                        <Select placeholder="Select a mood">
                            {moodOptions.map((mood) => (
                                <Select.Option key={mood} value={mood}>
                                    <Badge status={moodColors[mood] || "default"} /> {mood}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Summary Input */}
                    <Form.Item
                        name="summary"
                        label="Summary"
                        rules={[{ required: true, message: 'Please enter a summary' }]}
                        help="Press Enter for a new line in the summary"
                    >
                        <TextArea rows={3} placeholder="Write about your day..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HomePage;
