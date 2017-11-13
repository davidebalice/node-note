if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://<simo>:<simo>@ds159845.mlab.com:59845/note-prod'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/note'}
}
