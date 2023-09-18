
export default function email(link, msg){
   
    let mensagem = '<html>'+
                    '<body>'+   
                    '<div style="background-color: gray;"}>'+
                    '<div style="margin-top: 50px; color: white;">Prezado(a) Cliente,<div>'+
                    '<div style="color: white;">recebemos o seu pedido de '+msg+' em nossa plataforma!<div>'+
                    '<div style="color: white;">Para concluir seu pedido, pedimos que clique no botão e siga as instruções<div>'+
                    '<div style="margin-top: 50px;"><a href="'+link+'"><button style="background: #069cc2; border-radius: 6px; padding: 15px; cursor: pointer; color: #fff; border: none; font-size: 16px;">Validar Cadastro</button></a></div>'+
                    '<div style="margin-top: 50px;">Saudações da Prisma Conexão!<div>'+
                    '<div style="margin-top: 50px;"><spam>Caso tenha recebido esta mensagem por engano, por favor desconsidere.</spam></div>'+
                    '</div>'+
                    '</body>'+
                    '</html>'

    return mensagem
}