const spicedPg = require("spiced-pg");

// var dbUrl =
//     process.env.DATABASE_URL ||
//     "postgres://spicedling:password@localhost:5432/imageboard";

var db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:lewis:postgres@localhost:5432/imageboard");
}

exports.getImagesData = function() {
    const q = `SELECT * FROM images ORDER BY id DESC;`;
    // const q = `SELECT * FROM images ORDER BY id DESC LIMIT 6;`;
    return db.query(q).then(results => {
        return results.rows;
    });
};

exports.addImage = function(title, description, username, url) {
    const q = `
        INSERT INTO images(title, description, username, url)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `;
    const params = [title, description, username, url];
    return db.query(q, params).then(results => {
        console.log(
            "This has been inserted into the image table",
            results.rows[0]
        );
        return results.rows[0];
    });
};

exports.getImagesId = function(id) {
    const params = [id];
    const q = `
        SELECT * FROM images WHERE id = $1  ORDER BY id DESC;
        `;
    return db
        .query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("this is an getimages error");
        });
};
exports.getComments = function(id) {
    console.log("you have gotten into getComments in your db");
    const params = [id];
    const q = `
        SELECT * FROM comments WHERE images_id = $1  ORDER BY id DESC;
        `;
    return db
        .query(q, params)
        .then(results => {
            return results.rows;
        })
        .catch(err => {
            console.log("this is a get comments error");
        });
};

exports.addComment = function(username, comment, images_id) {
    const q = `
    INSERT INTO comments(username, comment, images_id)
    VALUES($1, $2, $3)

    RETURNING *
`;
    const params = [username, comment, images_id];
    return db.query(q, params).then(results => {
        console.log(
            "This comment has been added to your sql table",
            results.rows[0]
        );
        return results.rows[0];
    });
};

exports.getMoreImagesData = function() {
    const q = `SELECT id, title (SELECT id FROM images ORDER BY id ASC LIMIT 1)
    as first_id FROM images FROM images
    WHERE id < 4
    ORDER BY id DESC
    LIMIT 3;`;
    return db.query(q).then(results => {
        return results.rows;
    });
};
