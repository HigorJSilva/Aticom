const nodemailer = require("nodemailer");
const config = require('../config.json');

module.exports = {
async sendMail(alunoEmail, correcao, status) {

  let transporter = nodemailer.createTransport({
    host: config.email.gmailTransporter,
    port: 587,
    secure: false,
    auth: {
      user: config.email.email,
      pass: config.email.senha,
    },
  });

  let emailInfo = {}

  if(status){
      emailInfo.subject = config.email.concluirAtividades, 
      emailInfo.html = '<p>Suas atividades foram corrigidas e estão prontas para serem entregues a secretaria.'+
      ' Gere a planilha pelo Aticom e entregue-as juntantamente com duas cópias e os certificados</p>';
  }else{

    var html = '<p>Você recebeu as correções de suas atividades, certifique de realizar as alterações'+
    ' e envia-lás novamente.</p>'+
    '<h2><strong>Atividades</strong></h2>'
    correcao.forEach(atividade => {
      html = html + ('<div style=" -webkit-box-shadow: 5px 5px 15px 5px #949494; box-shadow: 5px 5px 15px 5px #949494; margin: 10px; padding:1px 10px"> '+
      '<p><strong>Descri&ccedil;&atilde;o da Atividade:&nbsp;</strong>&nbsp;'+atividade.descricao+'</p>'+
      '<p><strong>Corre&ccedil;&atilde;o sugerida:&nbsp;</strong>'+atividade.feedback+'</p></div>')
    });

    emailInfo.subject = config.email.corrigirAtividades, 
    emailInfo.html = html
     
  }

  let info = await transporter.sendMail({
    from: config.email.email,
    to: alunoEmail,
    subject: emailInfo.subject,
    text: emailInfo.text,
    html:  emailInfo.html,
  });


},
  async esquecisenha(newSenha, alunoEmail) {

		let transporter = nodemailer.createTransport({
		host: config.email.gmailTransporter,
		port: 587,
		secure: false,
		auth: {
			user: config.email.email,
			pass: config.email.senha,
		},
	});

	let emailInfo = {}

	console.log('esqueciSenha :>> ', config.email.esqueciSenha);
	console.log('config.email.email :>> ', config.email.email);
	console.log('config.email.senha :>> ', config.email.senha);

	emailInfo.subject = config.email.esqueciSenha,
	emailInfo.html = '<p>Sua nova senha está a baixo, você poderá usa-la para acessar o Aticom e criar uma'+
	' nova senha em seu perfil no Aticom. </p>'+
	'<h3><strong>Senha:&nbsp;'+newSenha+'</strong></h3>'

	let info = await transporter.sendMail({
		from: config.email.email,
		to: alunoEmail,
		subject: emailInfo.subject,
		html:  emailInfo.html,
	  });

	 console.log("Message sent: %s", info.messageId);

  }
}