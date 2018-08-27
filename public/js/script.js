(function() {
    Vue.component("fullmodal", {
        data: function() {
            return {
                title: "",
                url: "",
                desc: "",
                imageId: ["id"],
                username: "",
                comment: "",
                comments: []
            };
        },
        props: ["id"],
        mounted: function() {
            var self = this;
            axios
                .get("/getimages/" + this.id)
                .then(function(res) {
                    (self.title = res.data.title),
                    (self.url = res.data.url),
                    (self.desc = res.data.desc);
                    // console.log(res.data.title);
                    // console.log(res.data.url);
                })
                .then(() => {
                    var self = this;
                    axios.get("/comments/" + this.id).then(function(res) {
                        console.log(
                            "this.comments from get comments route: ",
                            self.comments
                        );
                        self.comments = res.data;
                        //
                        // (self.username = res.comments.username),
                        // (self.comment = res.comments.created_at),
                        // (self.created_at = res.comments.comment);
                    });
                });
        },
        watch: {
            id: function() {
                axios.get("/getimages/" + this.id).then(function(res) {
                    (self.title = res.data.title),
                    (self.url = res.data.url),
                    (self.desc = res.data.desc);
                    if (isNaN(this.imageId)) {
                        this.imageId = null;
                        location.hash = "";
                        //let axios request happen, if there is no image, fire modal to close, -- imageId to null
                    }
                });
            }
        },
        id: function() {
            axios.get("/comments/" + this.id).then(function(res) {
                (self.comment = res.data.comment),
                (self.username = res.data.username);
            });
        },
        methods: {
            submitcomment: function() {
                var self = this;
                console.log("this is method", this);
                axios
                    .post("/submit-comment", {
                        id: self.id,
                        comment: self.comment,
                        username: self.username
                    })
                    .then(result => {
                        self.comments.unshift(result.data.comment);
                        self.username = "";
                        self.comment = "";
                        self.errorComment = "";
                        location.reload();
                        alert("Thank you for you comment!");
                    });
            },
            hidemodal: function() {
                this.$emit("close");
            },
            change: function() {
                this.image;
            }
        },
        template: "#fullmodal"

        // template: '<div id="fullmodal"><img :src="url">IMAGE</img></div>'
    });

    var app = new Vue({
        el: "#main",
        data: {
            description: "",
            title: "",
            username: "",
            images: [],
            numOfImages: 0,
            numOfPages: 0,
            counter: 0,
            pages: 0,
            imageId: location.hash.slice(1)
            // comments: []
        },
        //hashchange - eventlistener  that will detect a change in the url bar  set image id in above to

        mounted: function() {
            var self = this;
            axios.get("/getimages").then(function(resp) {
                self.images = resp.data;
                // addEventListener("hashchange", function() {
                //     this.imageId = location.hash.slice(1);
                // });
                // console.log(resp.data);
            });
        },

        methods: {
            showModal: function(id) {
                this.imageId = id;
            },
            closeModal: function() {
                // this.imageId = id;
                this.imageId = null;
            },
            imageSelected: function(e) {
                alert("are you sure that you want to select this image?");
                // console.log(e.target.files[0]);
                this.imageFile = e.target.files[0];
            },
            upload: function() {
                console.log(
                    "the file is reaching the upload and converting into a formData object"
                );
                var formData = new FormData(); // var formData is an empty object
                // constructed by new FormData() constructor that specifically handles an image upload
                formData.append("file", this.imageFile);
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                axios.post("/upload", formData).then(function(res) {
                    if (res.data.success) {
                        alert("the file has successfully uploaded");
                        app.images.unshift(res.data.image);
                    } else {
                        console.log(
                            "there has been an error at the axios post route end"
                        );
                        true;
                    }
                });
            },
            showMoreImages: function() {
                if (app.counter != app.numOfPages) {
                    app.counter++;
                    axios
                        .get("/moreImages/" + app.counter * 6)
                        .then(function(results) {
                            for (var i = 0; i < results.data.length; i++) {
                                app.images.push(results.data[i]);
                            }
                        });
                } else {
                    console.log("no more images");
                }
            },

            addComment: function() {
                console.log(
                    "a new comment is going through the beginning of the add comment main vue method"
                );
                var commentData = {};
                commentData.append("username", this.user);
                commentDatad.append("comment", this.comment);
                commentData.append("images_id", this.imageId);
                console.log("commentData value in post route:", commentData);
                axios.post("/getimages/:id", commentData).then(function(res) {
                    if (res.data.success) {
                        alert("a new comment has been added! Thank you");
                        app.comments.unshift(res.data.comment);
                    } else {
                        console.log(
                            "there has been an error adding your comment"
                        );
                        true;
                    }
                });
            },
            updated: function() {
                console.log("updated");
            }
        }
    });

    ////////testing the heading///////////////
    // setTimeout(function() {
    //     app.heading = "yaaarrrgggghhhh";
    // }, 1750);

    // console.log(app.heading);
})();
