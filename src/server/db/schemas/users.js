const nameSchema = "users";

const schema = {
    username: String, 
    email: { type: String, unique:true },
    password:String,
};

module.exports = {
    schema,
    nameSchema
}