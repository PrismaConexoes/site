
export default function email(link){

    let mensagem = '<div style="background-color: gray;"}>'+
                    '<div style="margin-top: 5%; color: white">Prezado(a) Cliente,<div>'+
                    '<div style="color: white">recebemos o seu pedido de cadastro em nossa plataforma!<div>'+
                    '<div style="color: white">Para concluir seu cadastro, pedimos que clique no botão e siga as instruções<div>'+
                    '<div style="margin-top: 50px"><a href="'+link+'" style="background-color: green; color: black; margin-left: 15px; margin-right: 15px; height: 30px;">Validar Cadastro</a></div>'+
                    '<div style="margin-top: 50px;">Saudações da Prisma Conexão!<div>'+
                    '<div style="margin-top: 50px;"><spam>Caso tenha recebido esta mensagem por engano, por favor desconsidere.</spam></div>'+
                    '</div>'

    return mensagem
}