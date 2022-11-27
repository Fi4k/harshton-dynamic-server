const express = require('express');
const bodyPaser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const expressFileupload = require('express-fileupload');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'fi4k',
        database: 'harshtonDB'
    }
});

// console.log(db.select('*').from('gallery').then(data => { console.log(dataf) }));

const app = express();
app.use(bodyPaser.json());
app.use(cors());
app.use(expressFileupload());

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
    res.send("It is working!");
    //     });

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

app.post('/AddGallery', (req, res) => {

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

    // Use the mv() method to place the file in the upload directory (i.e. "uploads")
    file.mv('../uploads/gallery/' + file.name);



    db('webgallery').insert({ filename: fname, caption: cap, dateadded: fDate2 }).catch((err) => { console.log(err) });

    db.select('*').from('webgallery')
        .then(photos => {
            photos.forEach(photo => {
                console.log(photo);
            });
            // res.json(html);
        })
        .catch((err) => { console.log(err) });
    //send response
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
    html = '';
    db.select('*').from('webgallery')
        .then(photos => {
            photos.forEach(photo => {
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
                    '<img src="images/gallery/' + photo.filename + '" alt="1" width="100%">' +
                    '<div class="col-lg-12 caption">' +
                    '<p><b>' + photo.caption + '</b></p>' +
                    '</div>' +
                    '<div class="col-lg-12 date">' +
                    '<p>' + photo.dateadded + '</p>' +
                    '</div>' +
                    '</div>';
            });
            res.json(html);
        })
        .catch((err) => { console.log(err) });

})

app.get('/LoadGalleryAdmin', (req, res) => {
    html = '';
    db.select('*').from('webgallery')
        .then(photos => {
            // photos.forEach(photo => {
            //     const [day, month, date, year, other] = photo.datecreated.toString().split(' ');
            //     fDate = day + ' ' + month + ' ' + date + ' ' + year;
            //     html = html +
            //         // '<div class="col-lg-6">' +
            //         // '<img src="images/gallery/' + photo.filename + '" alt="1" width="100%">' +
            //         // '<div class="col-lg-6">' +
            //         // '<p class="caption">' + photo.caption + '</p>' +
            //         // '</div>' +
            //         // '<div class="col-lg-6">' +
            //         // '<p class="date">' + fDate + '</p>' +
            //         // '</div>' +
            //         // '</div>';
            //         '<div class="col-lg-6 img-block">' +
            //         '<img src="images/gallery/' + photo.filename + '" alt="1" width="100%">' +
            //         '<div class="col-lg-12 caption">' +
            //         '<p><b>' + photo.caption + '</b></p>' +
            //         '</div>' +
            //         '<div class="col-lg-12 date">' +
            //         '<p>' + fDate + '</p>' +
            //         '</div>' +
            //         '</div>';
            // });
            res.json(photos);
        })
        .catch((err) => { console.log(err) });

})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}!`);
})