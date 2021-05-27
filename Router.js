const express = require("express");
const { resolve } = require("path");

let user_id;


function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        user_id = req.user.id
        return next();
    }
    res.redirect("/login");
}

class Router {
    constructor(Method) {
        this.Method = Method;
    }

    router() {
        let router = express.Router();
        router.get("/", this.start.bind(this))
        router.get("/home", isLoggedIn, this.home.bind(this));
        router.get("/login", this.login.bind(this));
        router.get("/err", this.err.bind(this));
        router.post("/post", isLoggedIn, this.post.bind(this));
        router.delete("/:id", isLoggedIn, this.delete.bind(this));
        router.put("/:id", isLoggedIn, this.update.bind(this));
        router.get("/friend/:id", isLoggedIn, this.friend.bind(this));
        router.post("/:friendId/:noteId", isLoggedIn, this.makeComment.bind(this));
        router.get("/logout", this.logout.bind(this));
        router.delete("/pic/:id", this.removePic.bind(this));
        return router;
    }

    start(req, res) {
        res.redirect("/login")
    }


    home(req, res) {
        let object
        this.Method.GetNote(user_id).then((note) => {
            this.Method.GetComment().then((comment) => {
                this.Method.GetFriends(user_id).then((user) => {
                    object = {
                        'user': user,
                        'note': note,
                        'comment': comment
                    }
                    res.render('home', object)
                })
            })
        })
    }



    login(req, res) {
        res.render("login");
    }

    err(req, res) {
        res.render("err");
    }

    post(req, res) {
        let note = req.body.note
        if (req.files) {
            let reqUpload = req.files.upload
            if (reqUpload.length > 1) {
                let files = []
                for (let each of reqUpload) {
                    files.push(each.name)
                }
                this.Method.AddNote(user_id, note, JSON.stringify(files)).then(() => {
                    for (let x of reqUpload) {
                        this.Method.writefile(x.name, x.data)
                    }
                    res.redirect("/home")
                })

            } else {
                let files = []
                let data = req.files.upload.data
                let filename = new Date().getTime().toString()
                files.push(filename)
                this.Method.AddNote(user_id, note, JSON.stringify(files)).then(() => {
                    this.Method.writefile(files[0], data).then(() => {
                        res.redirect("/home")
                    })
                })
            }
        } else {
            this.Method.AddNote(user_id, note).then(() => {
                res.redirect("/home")
            })
        }
    }


    update(req, res) {
        let noteid = req.params.id;
        let newNote = req.body.note
        if (req.files) {
            let reqUpload = req.files.upload
            if (reqUpload.length > 1) {
                let files = []
                for (let each of reqUpload) {
                    files.push(each.name)
                }
                this.Method.EditNote(noteid, newNote, JSON.stringify(files)).then(() => {
                    for (let x of reqUpload) {
                        this.Method.writefile(x.name, x.data)
                    }
                    res.redirect("/home")
                })
            } else {
                let files = []
                let data = req.files.upload.data
                let filename = new Date().getTime().toString()
                files.push(filename)
                this.Method.EditNote(noteid, newNote, JSON.stringify(files)).then(() => {
                    this.Method.writefile(files[0], data).then(() => {
                        res.redirect("/home")
                    })
                })
            }
        } else {
            this.Method.EditNote(noteid, newNote).then(() => {
                res.redirect("/home")
            })
        }
    }

    delete(req, res) {
        let noteid = req.params.id;
        this.Method.RemoveComment(noteid).then(() => {
            this.Method.RemoveNote(noteid).then(() => {
                res.redirect("/home")
            })
        })
    }

    removePic(req, res) {
        let noteid = req.params.id;
        this.Method.deletePic(noteid)
        .then(() => {
          res.end();
        })
    }

    friend(req, res) {
        let friendId = req.params.id;
        let object
        this.Method.GetNote(friendId).then((note) => {
            this.Method.GetComment().then((comment) => {
                this.Method.GetFriends(user_id).then((user) => {
                    object = {
                        'user': user,
                        'note': note,
                        'comment': comment
                    }
                    res.render('friend', object)
                })
            })
        })
    }

    makeComment(req, res) {
        let friendId = req.params.friendId
        let noteid = req.params.noteId;
        let comment = req.body.comment
        this.Method.MakeComments(comment, noteid, user_id).then(() => {
            res.redirect(`/friend/${friendId}`)
        })
    }

    logout(req, res) {
        req.logout();
        res.redirect("/login")
    }

}

module.exports = Router;