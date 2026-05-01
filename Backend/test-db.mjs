import mongoose from 'mongoose';
import Problem from './src/models/Problem.js';

mongoose.connect('mongodb+srv://udaykenedev:sS3d7b4ZcI0Z0A66@cluster0.h9m7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    const p = await Problem.findOne({slug: 'two-sum'});
    console.log(JSON.stringify(p.testCases, null, 2));
    process.exit(0);
  });
