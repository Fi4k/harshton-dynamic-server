const express = require('express');
const bodyPaser = require('body-parser');
// const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
// const createTcpPool = require('./createTcpPool');
const expressFileupload = require('express-fileupload');

// const db = knex({
//     client: 'pg',
//     connection: {
//         connectionString: process.env.DATABASE_URL,
//         ssl: true,
//         // host: '127.0.0.1',
//         // user: 'postgres',
//         // password: 'fi4k',
//         // database: 'harshtonDB'
//     }
// });

const app = express();
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(bodyPaser.json());
app.use(expressFileupload());

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        // host: '127.0.0.1',
        // user: 'postgres',
        // password: 'fi4k',
        // database: 'harshtonDB'
    }
});

// let pool;

// app.use(async (req, res, next) => {
//     if (pool) {
//         return next();
//     }
//     try {
//         pool = await createPoolAndEnsureSchema();
//         next();
//     } catch (err) {
//         // logger.error(err);
//         return next(err);
//     }
// });

// const createPool = async () => {
//     // Configure which instance and what database user to connect with.
//     // Remember - storing secrets in plaintext is potentially unsafe. Consider using
//     // something like https://cloud.google.com/kms/ to help keep secrets secret.
//     const config = { pool: {} };

//     // [START cloud_sql_postgres_knex_limit]
//     // 'max' limits the total number of concurrent connections this pool will keep. Ideal
//     // values for this setting are highly variable on app design, infrastructure, and database.
//     config.pool.max = 5;
//     // 'min' is the minimum number of idle connections Knex maintains in the pool.
//     // Additional connections will be established to meet this value unless the pool is full.
//     config.pool.min = 5;
//     // [END cloud_sql_postgres_knex_limit]

//     // [START cloud_sql_postgres_knex_timeout]
//     // 'acquireTimeoutMillis' is the number of milliseconds before a timeout occurs when acquiring a
//     // connection from the pool. This is slightly different from connectionTimeout, because acquiring
//     // a pool connection does not always involve making a new connection, and may include multiple retries.
//     // when making a connection
//     config.pool.acquireTimeoutMillis = 60000; // 60 seconds
//     // 'createTimeoutMillis` is the maximum number of milliseconds to wait trying to establish an
//     // initial connection before retrying.
//     // After acquireTimeoutMillis has passed, a timeout exception will be thrown.
//     config.pool.createTimeoutMillis = 30000; // 30 seconds
//     // 'idleTimeoutMillis' is the number of milliseconds a connection must sit idle in the pool
//     // and not be checked out before it is automatically closed.
//     config.pool.idleTimeoutMillis = 600000; // 10 minutes
//     // [END cloud_sql_postgres_knex_timeout]

//     // [START cloud_sql_postgres_knex_backoff]
//     // 'knex' uses a built-in retry strategy which does not implement backoff.
//     // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
//     config.pool.createRetryIntervalMillis = 200; // 0.2 seconds
//     // [END cloud_sql_postgres_knex_backoff]

//     // Check if a Secret Manager secret version is defined
//     // If a version is defined, retrieve the secret from Secret Manager and set as the DB_PASS
//     // const { CLOUD_SQL_CREDENTIALS_SECRET } = process.env;
//     // if (CLOUD_SQL_CREDENTIALS_SECRET) {
//     //     const secrets = await accessSecretVersion(CLOUD_SQL_CREDENTIALS_SECRET);
//     //     try {
//     //         process.env.DB_PASS = secrets.toString();
//     //     } catch (err) {
//     //         err.message = `Unable to parse secret from Secret Manager. Make sure that the secret is JSON formatted: \n ${err.message} `;
//     //         throw err;
//     //     }
//     // }

//     if (process.env.INSTANCE_HOST) {
//         // Use a TCP socket when INSTANCE_HOST (e.g., 127.0.0.1) is defined
//         return createTcpPool(config);
//     } else if (process.env.INSTANCE_UNIX_SOCKET) {
//         // Use a Unix socket when INSTANCE_UNIX_SOCKET (e.g., /cloudsql/proj:region:instance) is defined.
//         return createUnixSocketPool(config);
//     } else {
//         throw 'One of INSTANCE_HOST or INSTANCE_UNIX_SOCKET` is required.';
//     }
// };

// const ensureSchema = async pool => {
//     const hasTable = await pool.schema.hasTable('webgallery');
//     // if (!hasTable) {
//     //     return pool.schema.createTable('votes', table => {
//     //         table.increments('vote_id').primary();
//     //         table.timestamp('time_cast', 30).notNullable();
//     //         table.specificType('candidate', 'CHAR(6)').notNullable();
//     //     });
//     // }
//     // logger.info("Ensured that table 'votes' exists");
// };

// const createPoolAndEnsureSchema = async () =>
//     await createPool()
//         .then(async pool => {
//             await ensureSchema(pool);
//             return pool;
//         })
//         .catch(err => {
//             // logger.error(err);
//             throw err;
//         });

// const insertVote = async (pool, vote) => {
//     try {
//         return await pool('votes').insert(vote);
//     } catch (err) {
//         throw Error(err);
//     }
// };
// const getVotes = async pool => {
//     return await pool
//         .select('candidate', 'time_cast')
//         .from('votes')
//         .orderBy('time_cast', 'desc')
//         .limit(5);
// };
// const getVoteCount = async (pool, candidate) => {
//     return await pool('votes').count('vote_id').where('candidate', candidate);
// };
// const httpGet = async (req, res) => {
//     pool = pool || (await createPoolAndEnsureSchema());
//     try {
//         // Query the total count of "TABS" from the database.
//         const tabsResult = await getVoteCount(pool, 'TABS');
//         const tabsTotalVotes = parseInt(tabsResult[0].count);
//         // Query the total count of "SPACES" from the database.
//         const spacesResult = await getVoteCount(pool, 'SPACES');
//         const spacesTotalVotes = parseInt(spacesResult[0].count);
//         // Query the last 5 votes from the database.
//         const votes = await getVotes(pool);
//         // Calculate and set leader values.
//         let leadTeam = '';
//         let voteDiff = 0;
//         let leaderMessage = '';
//         if (tabsTotalVotes !== spacesTotalVotes) {
//             if (tabsTotalVotes > spacesTotalVotes) {
//                 leadTeam = 'TABS';
//                 voteDiff = tabsTotalVotes - spacesTotalVotes;
//             } else {
//                 leadTeam = 'SPACES';
//                 voteDiff = spacesTotalVotes - tabsTotalVotes;
//             }
//             leaderMessage =
//                 `${leadTeam} are winning by ${voteDiff} vote` + voteDiff > 1 ? 's' : '';
//         } else {
//             leaderMessage = 'TABS and SPACES are evenly matched!';
//         }
//         res.render('index.pug', {
//             votes: votes,
//             tabsCount: tabsTotalVotes,
//             spacesCount: spacesTotalVotes,
//             leadTeam: leadTeam,
//             voteDiff: voteDiff,
//             leaderMessage: leaderMessage,
//         });
//     } catch (err) {
//         console.error(err);
//         res
//             .status(500)
//             .send('Unable to load page; see logs for more details.')
//             .end();
//     }
// };

// app.get('/', httpGet);

// const httpPost = async (req, res) => {
//     pool = pool || (await createPoolAndEnsureSchema());
//     // Get the team from the request and record the time of the vote.
//     const { team } = req.body;
//     const timestamp = new Date();

//     if (!team || (team !== 'TABS' && team !== 'SPACES')) {
//         res.status(400).send('Invalid team specified.').end();
//         return;
//     }

//     // Create a vote record to be stored in the database.
//     const vote = {
//         candidate: team,
//         time_cast: timestamp,
//     };

//     // Save the data to the database.
//     try {
//         await insertVote(pool, vote);
//     } catch (err) {
//         logger.error(`Error while attempting to submit vote:${err}`);
//         res
//             .status(500)
//             .send('Unable to cast vote; see logs for more details.')
//             .end();
//         return;
//     }
//     res.status(200).send(`Successfully voted for ${team} at ${timestamp}`).end();
// };

// app.post('*', httpPost);

// createTcpPool initializes a TCP connection pool for a Cloud SQL
// instance of Postgres.
// const db = async config => {
//     const dbConfig = {
//         client: 'pg',
//         connection: {
//             // host: process.env.INSTANCE_HOST, // e.g. '127.0.0.1'
//             // port: process.env.DB_PORT, // e.g. '5432'
//             // user: process.env.DB_USER, // e.g. 'my-user'
//             // password: process.env.DB_PASS, // e.g. 'my-user-password'
//             // database: process.env.DB_NAME, // e.g. 'my-database'
//             user: process.env.DB_USER, // e.g. 'my-user'
//             password: process.env.DB_PASS, // e.g. 'my-user-password'
//             database: process.env.DB_NAME, // e.g. 'my-database'
//             host: process.env.INSTANCE_UNIX_SOCKET, // e.g. '/cloudsql/project:region:instance'
//         },
//         // // ... Specify additional properties here.
//         // ...config,
//     };
// Establish a connection to the database.
//     return Knex(dbConfig);
// };

// console.log(db.select('*').from('gallery').then(data => { console.log(dataf) }));



// const db1 = {
//     users: [
//         {
//             id: '4',
//             name: 'fik',
//             email: 'fik@mail.com',
//             password: '123',
//             role: 'admin',
//             created: new Date(),
//         }
//     ],
//     login: [
//         {
//             id: '4',
//             email: 'fik@mail.com',
//             hash: '$2a$10$UlALC.HxXDsKBHUhYhYHFeGDo8RfAa3Vfxvj0h86VyGfLnN66LYOy'
//         }
//     ],
//     Gallery: [
//         '1.jpg',
//         '2.jpg',
//         '3.jpg',
//         '4.jpg',
//     ]
// }

app.get('/', (req, res) => {
    // html = '';
    // db.select('*').from('gallery')
    //     .then(photos => {
    //         console.log(photos);
    //         photos.forEach(photo => {
    //             html = html +
    //                 '<div class="col-lg-6">' +
    //                 '<img src="images/' + photo.filename + '" alt="img" width="100%">' +
    //                 '</div>';
    //         });
    res.send("Root is working!");
    //     });

})

app.post('/Login', async (req, res) => {
    // console.log(req.body)
    // console.log(req.email);
    // console.log(req.body);

    // console.log(req.files.file.name);

    // let found = false;

    // await db.select('*').from('users').where({ email: req.body.email })
    db('users').where('uemail', req.body.email).select()
        .then(user => {
            if (user.length) {
                res.json(user[0].uname);
            } else {
                res.json('No such user!');
            }
            // console.log(user[0].uname);
        })
        .catch((err) => { console.log(err) });

    // if (!found) {

    // }
})

// app.post('/AdddGallery', async (req, res) => {
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             })
//         } else {
//             // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
//             let avatar = req.files.avatar

//             // Use the mv() method to place the file in the upload directory (i.e. "uploads")
//             // avatar.mv('./uploads/' + avatar.name)

//             //send response
//             res.send({
//                 status: true,
//                 message: 'File is uploaded',
//                 data: {
//                     name: avatar.name,
//                     mimetype: avatar.mimetype,
//                     size: avatar.size
//                 }
//             })
//         }
//     } catch (err) {
//         res.status(500).send(err)
//     }
// })

app.post('/AddGallery', async (req, res) => {
    // res.send("Add gal is working!");
    let day;

    if (new Date().getDay() == 1)
        day = 'Mon'
    else if (new Date().getDay() == 2)
        day = 'Tue'
    else if (new Date().getDay() == 3)
        day = 'Wed'
    else if (new Date().getDay() == 4)
        day = 'Thu'
    else if (new Date().getDay() == 5)
        day = 'Fri'
    else if (new Date().getDay() == 6)
        day = 'Sat'
    else
        day = 'Sun'

    let fDate2 = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1).toString() + '-' + new Date().getDate().toString()

    console.log(fDate2);

    console.log(req.body)
    console.log(req.body.caption);
    console.log(req.files.file.name);

    // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let file = req.files.file;

    let fname = file.name;
    let cap = req.body.caption;
    let fDate = Date.now()

    console.log(fDate);

    console.log(fname, cap);

    try {
        // Use the mv() method to place the file in the upload directory (i.e. "uploads")
        file.mv('./uploads/gallery/' + file.name);

        db('webgallery').insert({ filename: fname, caption: cap, dateadded: fDate2 })

        res.send(JSON.stringify('added'));

    }
    catch (err) { console.log(err) }

    // db.select('*').from('webgallery')
    //     .then(photos => {
    //         photos.forEach(photo => {
    //             console.log(photo);
    //         });
    //         // res.json(html);
    //     })
    //     .catch((err) => { console.log(err) });
    // //send response
    // res.send({
    //     status: true,
    //     message: 'File is uploaded',
    //     data: {
    //         name: file.name,
    //         mimetype: file.mimetype,
    //         size: file.size
    //     }
    // })
})

app.get('/LoadGalleryWeb', (req, res) => {
    // res.send("Load gal web is working!");
    html = '';
    db.select('*').from('webgallery')
        .then(rows => {
            rows.forEach(row => {
                // const [day, month, date, year, other] = photo.dateadded.toString().split(' ');
                // fDate = day + ' ' + month + ' ' + date + ' ' + year;
                html = html +
                    // '<div class="col-lg-6">' +
                    // '<img src="images/gallery/' + photo.filename + '" alt="1" width="100%">' +
                    // '<div class="col-lg-6">' +
                    // '<p class="caption">' + photo.caption + '</p>' +
                    // '</div>' +
                    // '<div class="col-lg-6">' +
                    // '<p class="date">' + fDate + '</p>' +
                    // '</div>' +
                    // '</div>';
                    '<div class="col-lg-6 img-block">' +
                    '<img src="images/gallery/' + row.filename + '" alt="1" width="100%">' +
                    '<div class="col-lg-12 caption">' +
                    '<p><b>' + row.caption + '</b></p>' +
                    '</div>' +
                    '<div class="col-lg-12 date">' +
                    '<p>' + row.dateadded + '</p>' +
                    '</div>' +
                    '</div>';
            });
            res.json(html);
        })
        .catch((err) => { console.log(err) });
})

app.get('/LoadGalleryAdmin', (req, res) => {
    // res.send("Load gal admin is working!");
    // var html = '';
    // const getGallery = async db => {
    //     return await db
    //         .select('*')
    //         .from('webgallery');
    //     // .orderBy('time_cast', 'desc')
    //     // .limit(5);
    // };

    db.select('*').from('webgallery').then(rows => {
        // rows.forEach(row => {
        //     // const [day, month, date, year, other] = row.dateadded.toString().split(' ');
        //     // fDate = day + ' ' + month + ' ' + date + ' ' + year;
        //     html = html +
        //         '<div class="col-lg-6">' +
        //         '<img src="images/gallery/' + "row.filename" + '" alt="1" width="100%">' +
        //         '<div class="col-lg-6">' +
        //         '<p class="caption">' + "row.caption" + '</p>' +
        //         '</div>' +
        //         '<div class="col-lg-6">' +
        //         '<p class="date">' + "row.dateadded" + '</p>' +
        //         '</div>' +
        //         '</div>';
        //     // '<div class="col-lg-6 img-block">' +
        //     //     '<img src="images/gallery/' + getGallery.filename + '" alt="1" width="100%">' +
        //     //     '<div class="col-lg-12 caption">' +
        //     //     '<p><b>' + getGallery.caption + '</b></p>' +
        //     //     '</div>' +
        //     //     '<div class="col-lg-12 date">' +
        //     //     '<p>' + fDate + '</p>' +
        //     //     '</div>' +
        //     //     '</div>';
        // });
        // res.write(rows);
        res.send(JSON.stringify(rows));
    }).catch((err) => { console.log(err) });

})

app.post('/DeleteGallery', async (req, res) => {
    await db('webgallery').where('id', req.body.id).del()
        .then(() => {
            res.send(JSON.stringify('deleted'));
        }).catch((err) => { console.log(err) });

})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}!`);
})