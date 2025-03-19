import  mongoose , { Schema }from 'mongoose'; 
import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken' ;

const Userchema  =  new Schema({
     name : {
        type : String,  
        required : true , 
        minlength: 3,

     }  , 
        email : {
            type : String,  
            required : true
        }  ,    
        password : {
            type : String,  
            required : true ,
            minlength: 6,

        }  ,

        Subscribers : {
            type: [Schema.Types.ObjectId],
            ref: 'User',
          
            
              
        }
         , 
        SubscribeTo : {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: [] 
        } , 

            viedos : {
                type: [Schema.Types.ObjectId],
                ref: 'Viedo',
                default: [] 

            } , 
            likedVideos: [
                {
                  type: [mongoose.Schema.Types.ObjectId] ,
                  ref: 'Videos' ,
                    default: []
                },
              ],
              watchHistory: [
                {
                  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
                  watchedAt: { type: Date, default: Date.now },
                }
              ],

              playlists: [
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Playlist',
                  default: []
                }
              ],




} , {timestamps : true} ) ;


Userchema.methods.hashPassword = async function(password){
    return await bcrypt.hash(password, 10) ; 
}

Userchema.methods.comparePassword = async function(password){
    const ans  =   await bcrypt.compare(password ,  this.password) ;
     return ans  ;  
}

Userchema.methods.generateToken = function(){
     const token  =  jwt.sign({id: this._id}, process.env.JWT_SECRET) ;
     return  token  ; 
}




 const User = mongoose.model('User', Userchema) ; 
 export default User ;


