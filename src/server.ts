import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import { error } from 'console';

let server: Server;


const startServer = async () => {
    try{
            await mongoose.connect('mongodb+srv://tour-management-backend:rMEZLmP2KQOiF4De@cluster0.hrjn1tt.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0')
            .then(() => {
                console.log('Connected to MongoDB');
            })

            server = app.listen (5000, () => {
                console.log('Server is running on port 5000');
            })

    } catch(error) {
        console.log('Error connecting to MongoDB:', error);
    }
}

startServer();

process.on("SIGTERM", () => {
    console.log('SIGTERM signal received: closing HTTP server');
    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

process.on("unhandledRejection", (error) => {
    console.error('Unhandled Rejection:', error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }

})

process.on("uncaughtException",(error) => {
    console.error('Uncaught Exception:', error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
})

// throw new Error('This is a test error to check uncaught exception handling');