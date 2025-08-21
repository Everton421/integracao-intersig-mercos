
import winston from "winston";

const { combine, timestamp, printf,colorize, json, cli, align  } = winston.format;

 const loggerPedidos = winston.createLogger({
    level: 'info',
    format: combine( timestamp( { format:"YYYY-mm-dd hh:mm:ss"}),json()) ,
    transports: [ new winston.transports.File({ filename:"pedidos.log" , dirname:'logs'} )],
})

 
 const loggerProdutos = winston.createLogger({
    level: 'info',
    format: combine( timestamp( { format:"YYYY-mm-dd hh:mm:ss"}),json()) ,
    transports: [ new winston.transports.File({ filename:"produtos.log", dirname:'logs'} )],
})



 export { loggerPedidos, loggerProdutos }