'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create admin user
        const adminId = uuidv4();
        const salt = await bcrypt.genSalt(12);
        const adminPassword = await bcrypt.hash('Admin1234!', salt);

        await queryInterface.bulkInsert('users', [
            {
                id: adminId,
                email: 'admin@rideadmin.com',
                password: adminPassword,
                full_name: 'Admin User',
                phone_number: '+1234567890',
                role: 'admin',
                is_email_verified: true,
                status: 'active',
                country_code: 'US',
                country: 'United States',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        // Create drivers
        const driverIds = [];
        const userIds = [];

        for (let i = 1; i <= 5; i++) {
            const userId = uuidv4();
            userIds.push(userId);

            const driverId = uuidv4();
            driverIds.push(driverId);

            const password = await bcrypt.hash(`Driver${i}1234!`, salt);

            // Create driver user
            await queryInterface.bulkInsert('users', [
                {
                    id: userId,
                    email: `driver${i}@example.com`,
                    password: password,
                    full_name: `Driver ${i}`,
                    phone_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                    profile_image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i}.jpg`,
                    role: 'driver',
                    is_email_verified: true,
                    status: 'active',
                    country_code: 'US',
                    country: 'United States',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]);

            // Create driver record
            await queryInterface.bulkInsert('drivers', [
                {
                    id: driverId,
                    user_id: userId,
                    license_number: `DL${100000 + i}`,
                    license_expiry_date: new Date(2027, 0, 1),
                    rating: (3 + Math.random() * 2).toFixed(1),
                    is_active: true,
                    total_trips: Math.floor(10 + Math.random() * 90),
                    total_earnings: (500 + Math.random() * 2000).toFixed(2),
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]);
        }

        // Create clients
        const clientIds = [];

        for (let i = 1; i <= 5; i++) {
            const clientId = uuidv4();
            clientIds.push(clientId);

            const password = await bcrypt.hash(`Client${i}1234!`, salt);

            await queryInterface.bulkInsert('users', [
                {
                    id: clientId,
                    email: `client${i}@example.com`,
                    password: password,
                    full_name: `Client ${i}`,
                    phone_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                    profile_image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 5}.jpg`,
                    role: 'user',
                    is_email_verified: true,
                    status: 'active',
                    country_code: 'US',
                    country: 'United States',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]);
        }

        // Create orders
        const carComforts = ['basic', 'standard', 'premium', 'luxury'];
        const statuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
        const locations = [
            'Besh Aray, Furkat Street, Tashkent, Uzbekistan',
            '21 Hamidulla Oripov ko\'chasi, Toshkent, Uzbekistan',
            '78 Фаргона Йули, Тошкент, Uzbekistan',
            '13 Kumorik ko\'chasi, Tashkent 100167, Uzbekistan',
            '1 Kuyi Toshkent ko\'chasi, Toshkent 100091, Uzbekistan'
        ];

        const orders = [];

        for (let i = 0; i < 50; i++) {
            const driverIndex = Math.floor(Math.random() * driverIds.length);
            const clientIndex = Math.floor(Math.random() * clientIds.length);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const comfort = carComforts[Math.floor(Math.random() * carComforts.length)];

            // Random date in the past 90 days
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));

            const startLocation = locations[Math.floor(Math.random() * locations.length)];
            let finishLocation;
            do {
                finishLocation = locations[Math.floor(Math.random() * locations.length)];
            } while (finishLocation === startLocation);

            const income = (10 + Math.random() * 90).toFixed(2);
            const rating = status === 'completed' ? (3 + Math.random() * 2).toFixed(1) : null;

            orders.push({
                id: uuidv4(),
                driver_id: driverIds[driverIndex],
                client_id: clientIds[clientIndex],
                car_comfort: comfort,
                ordered_time: date,
                start_location: startLocation,
                finish_location: finishLocation,
                income: income,
                status: status,
                distance: (1 + Math.random() * 19).toFixed(1),
                duration: Math.floor(5 + Math.random() * 55),
                rating: rating,
                client_comment: rating ? 'Good service.' : null,
                created_at: date,
                updated_at: date
            });
        }

        await queryInterface.bulkInsert('orders', orders);

        // Create statistics
        const currentYear = new Date().getFullYear();
        const statistics = [];

        for (let month = 1; month <= 12; month++) {
            const completedOrders = orders.filter(
                order =>
                    order.status === 'completed' &&
                    new Date(order.ordered_time).getMonth() + 1 === month &&
                    new Date(order.ordered_time).getFullYear() === currentYear
            );

            const totalOrders = completedOrders.length;
            const totalEarnings = completedOrders.reduce((sum, order) => sum + parseFloat(order.income), 0);
            const totalProfit = totalEarnings * 0.2;

            const ratings = completedOrders
                .filter(order => order.rating)
                .map(order => parseFloat(order.rating));

            const averageGrade = ratings.length > 0
                ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
                : 0;

            statistics.push({
                id: uuidv4(),
                month: month,
                year: currentYear,
                average_grade: averageGrade.toFixed(1),
                exams_count: ratings.length,
                total_orders: totalOrders,
                total_earnings: totalEarnings.toFixed(2),
                total_profit: totalProfit.toFixed(2),
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        await queryInterface.bulkInsert('statistics', statistics);
    },

    async down(queryInterface, Sequelize) {
        // Remove all seeded data
        await queryInterface.bulkDelete('statistics', null, {});
        await queryInterface.bulkDelete('orders', null, {});
        await queryInterface.bulkDelete('drivers', null, {});
        await queryInterface.bulkDelete('users', null, {});
    }
};