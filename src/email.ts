
export default function email(link){

    let mensagem = '<div style="background-color: gray;"}>'+
                    '<div style="margin-top: 5%; color: white">Prezado(a) Cliente,<div>'+
                    '<div color: white">recebemos o seu pedido de cadastro em nossa plataforma!<div>'+
                    '<div color: white">Para concluir seu cadastro, pedimos que clique no botão e siga as instruções<div>'+
                    '<div"><a href="'+link+'" style="background-color: blue; color: black;">Validar Cadastro</a><div>'+
                    '<div style="margin-top: 5%;">Saudações da Prisma Conexão!<div>'+
                    '<div style="margin-top: 5%;"><spam>Caso tenha recebido esta mensagem por engano, por favor desconsidere.</spam></div>'+
                    '</div>'

    return mensagem
}