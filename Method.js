const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);
const fs = require("fs")
const path = require("path")
const uploadDir = path.join(__dirname, "public", "upload")

class Method {
    constructor(knex) {
        this.knex = knex;
    }

    GetNote(user_id) {
        return knex.select(['notes.id as note_id', 'notes.note', 'notes.file as file', 'notes.user_id', 'users.name as user_name'])
            .from('notes')
            .innerJoin('users', 'users.id', 'notes.user_id')
            .where('notes.user_id', user_id)
            .orderBy('note_id', 'asc')
            .then((data) => {
                return data
            })
    }

    GetComment() {
        return knex.select(['comments.note_id as note_id', 'comments.id as comment_id', 'comments.comment as comment', 'users.name as commentby'])
            .from('comments')
            .innerJoin('users', 'users.id', 'comments.user_id')
            .then((data) => {
                return data
            })
    }

    GetFriends(user_id) {
        return knex.select('id', 'name')
            .from('users')
            .then((data) => {
                return data.filter((each) => {
                    return each.id !== user_id
                })
            })
    }

    AddNote(user_id, note, filename) {
        return knex.insert({
            note: note,
            file: filename,
            user_id: user_id,
        }).into("notes")
    }

    RemoveComment(note_id) {
        return knex('comments').where('note_id', note_id).del()
    }

    RemoveNote(note_id) {
        return knex('notes').where('id', note_id).del()

    }

    EditNote(note_id, newNote, newFile) {
        return knex('notes').update({
            note: newNote,
            file: newFile,
        }).where('id', note_id)
    }

    MakeComments(comment, note_id, user_id) {
        return knex.insert({
            comment: comment,
            note_id: note_id,
            user_id: user_id
        }).into("comments")
    }

    writefile(name, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(uploadDir, name), data, (err) => {
                if (err) {
                    console.log("Error", err)
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    deletePic(note_id){
        return knex('notes').update({
            file: null,
        }).where('id', note_id)
    }


}

module.exports = Method;