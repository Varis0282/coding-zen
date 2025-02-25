import React, { useState } from 'react';
import { Calendar, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    const validRange: [Dayjs, Dayjs] = [dayjs().subtract(30, 'day'), dayjs()];

    const onSelectDate = (date: Dayjs) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

    return (
        <div className="w-full">
            <Calendar onSelect={onSelectDate} validRange={validRange} />
            <Modal
                title="Selected Date"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}</p>
            </Modal>
        </div>
    );
};

export default HomePage;
