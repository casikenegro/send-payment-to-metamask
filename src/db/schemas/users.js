const nameSchema = "users";

const schema = {
    name: String, 
    lastname: String, 
    email: { type: String, unique:true },
    password:String,
};

module.exports = {
    schema,
    nameSchema
}