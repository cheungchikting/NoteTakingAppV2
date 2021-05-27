
    GetNote(user_id) {
        return knex.select(['notes.id as note_id', 'notes.note', 'users.name as user_name', 'comments.comment as comment', 'comments.user_id as commentby'])
            .from('notes')
            .innerJoin('users', 'users.id', 'notes.user_id')
            .innerJoin('comments', 'notes.id', 'comments.note_id')
            .where('notes.user_id', user_id)
            .then((data) => {
                let result
                for (let each of data) {
                    result = knex.select("name").from("users").where("id", each.commentby)
                        .then((name) => {
                            each.commentby = name[0].name
                            return data
                        })
                }
                return result
            })
    }