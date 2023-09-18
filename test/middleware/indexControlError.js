import EError from "../enum.js";

export default (error, req, res, next)=>{
    console.log( "\u001b[1;36m Ingreso al Middleware de errores")
    switch(error.code){
        case EError.INVALID_TYPES_ERROR:
        res.send({status:"Error", error:error.name})
        break
        default:
            res.send({status:"Error", error: "Error desconocido"})
    }
}