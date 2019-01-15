function GetReqHTML (req, sync = true, id){//req est un objet qui contient le nom, la methode, l'url | sync est un booléen de synchronisation | id est un objet qui a l'id de co et le mdp
	let xhrHTML = new XMLHttpRequest();
	if (req.name) this.name= req[1];
	else this.name = req[0];
	if(req.methode) this.methode = req.methode;
	else this.methode = req[1]; 
	if(req.url) this.url = req.url;
	else this.url = req[2];
	if(id){//si il faut un login pour le get
		xhrHTML.open(this.methode,this.url,sync,id[0],id[1]);
	}
	else xhrHTML.open(this.methode,this.url,sync);//sans login pour le get 
	this.xhr = xhrHTML;
	if (xhrHTML.status >= 200 && xhrHTML.status < 400) { 
		//le serveur a réussi à traiter la requête
        console.log(xhrHTML.responseText);
    } else {
        //affichage des informations sur l'échec du traitement de la requête
        console.error(xhrHTML.status + " " + xhrHTML.statusText);
    }
}

function PostReqHTML (req, sync = true, id,...args){//en cas de post
	GetReqHTML(req,sync,id);
	let tab;
	for (let i = 0 ; i<args.length;i i++ ){
		tab = tab + args[i];
	}
	this.xhr.send(tab);

}