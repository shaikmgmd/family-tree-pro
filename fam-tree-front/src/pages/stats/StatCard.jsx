import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ title, value }) => (
    <div className="bg-green-ftpro hover:bg-green-ftpro-h cursor-pointer rounded-lg p-4 shadow-lg transition-all">
        <h4 className="text-white text-xl font-semibold mb-3">{title}</h4>
        <p className="text-white text-3xl">{value}</p>
    </div>
);

export default StatCard;
