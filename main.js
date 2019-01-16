var controller = new Leap.Controller({
                         enableGestures: true,
                         frameEventName: 'animationFrame'
                         });

var dispMains = document.getElementById('mains');
var dispAction = document.getElementById('action');
var dispType = document.getElementById('type');
var dispForme = document.getElementById('forme');
var dispMouvement = document.getElementById('mouvement');
var dispGeste = document.getElementById('geste');

var dispType2 = document.getElementById('type2');
var dispForme2 = document.getElementById('forme2');
var dispMouvement2 = document.getElementById('mouvement2');
var dispGeste2 = document.getElementById('geste2');

var dispTest1 = document.getElementById('test1');
var dispTest2 = document.getElementById('test2');

var type1 = "";
var forme1 = "";
var mouvement1 = "";

var type2 = "";
var forme2 = "";
var mouvement2 = "";

var geste1 = "";

var date = new Date();
var tstamp = date.getTime();

var previous1 = [];

var liste_gestes = [
	["PalmeFaceGauche","PalmeFaceDroite","PalmeFaceGauche"],
	["MetalFront"],
	["JUL"],
	["PoingHautFerme","PoingHautOuvert"],
	["PoingHautOuvert","PoingHautFerme"],
	["PoussePlat"],
	["CoupDePoingGauche","CoupDePoingDroit"],
	["CoupDePoingDroit","CoupDePoingGauche"],
	["SwipeDroit1","SwipeDroit2"],
	["SwipeGauche1","SwipeGauche2"],
	["RPSPoingBas","RPSPoingHaut","RPSPoingBas","RPSPoingHaut","RPSPoingBas"],
	["RPSPoingBas","RPSPoingHaut","RPSPoingBas","RPSPoingHaut","RPSFeuille"],
	["RPSPoingBas","RPSPoingHaut","RPSPoingBas","RPSPoingHaut","RPSCiseaux"],
	["PoingHautOuvert","SwipeBack"],
	["PointeCurseurClic"]
	/* // Analogiques
	["PincerEtirement"],
	["PointeCurseur"]
	*/
];

var taille_liste_gestes = 0;
for(let i = 0; i < liste_gestes.length; i++){
	if(liste_gestes[i].length > taille_liste_gestes) taille_liste_gestes = liste_gestes[i].length;
}
for(let i = 0; i < taille_liste_gestes; i++){
	previous1.push("");
}

var formeMain = function(main){
	let fre;
	if(main.thumb.extended && main.indexFinger.extended && main.middleFinger.extended && main.ringFinger.extended && main.pinky.extended && main.grabStrength <= 0){
		fre = "Main plate";
	}else if(!main.thumb.extended && main.indexFinger.extended && !main.middleFinger.extended && !main.ringFinger.extended && main.pinky.extended){
		fre = "Metal";
	}else if(main.indexFinger.extended && !main.middleFinger.extended && !main.ringFinger.extended && !main.pinky.extended){
		fre = "Pointe";
	}else if(main.indexFinger.extended && main.middleFinger.extended && !main.ringFinger.extended && !main.pinky.extended && main.thumb.extended){
		fre = "Pistolet";
	}else if(main.grabStrength >= 1){
		fre = "Poing";
	}else if(main.indexFinger.extended && main.middleFinger.extended && !main.ringFinger.extended && !main.pinky.extended && !main.thumb.extended){
        fre = "Ciseaux";
	}else if(main.pinchStrength >= 0.95 ){
        fre = "Pincer";
	}else if(!main.thumb.extended && main.indexFinger.extended && main.middleFinger.extended && !main.ringFinger.extended && !main.pinky.extended ){
		fre = "victory";
	}else {
		fre = "";
	}
	return fre;
};

var mouvementMain = function(main){
	let fre;
	if(main.palmVelocity[0] < -400){
		fre = "Vers la gauche";
	}else if(main.palmVelocity[0] > 400){
		fre = "Vers la droite";
	}else if(main.palmVelocity[1] > 400){
		fre = "Vers le haut";
	}else if(main.palmVelocity[1] < -400){
		fre = "Vers le bas";
	}else if(main.palmVelocity[2] < -400){
		fre = "En avant";
	}else if(main.palmVelocity[2] > 400){
		fre = "En arriere";
	}else{
		fre = "";
	}
	return fre;
};

var typeMain = function(main){
	let fre;
	if(main.type == "right"){
		fre = "Main Droite";
	}else if(main.type == "left"){
		fre = "Main Gauche";
	}
	return fre;
};

controller.on('frame', function(frame){
	// Nombre de mains
	dispMains.innerText = frame.hands.length;

	main1 = undefined;
	main2 = undefined;
		
	type1 = "";
	type2 = "";
	
	// Forme
	forme1 = "";
	forme2 = "";
	
	// Mouvement	
	mouvement1 = "";
	mouvement2 = "";
	
	if(frame.hands.length >= 2){
		main1 = frame.hands[0];
		main2 = frame.hands[1];

		// Type
		type1 = typeMain(main1);
		if(type1 == "Main Droite"){
			main1 = frame.hands[1];
			main2 = frame.hands[0];
		}
		type1 = typeMain(main1);
		type2 = typeMain(main2);

		// Forme
		forme1 = formeMain(main1);
		forme2 = formeMain(main2);

		// Mouvement
		mouvement1 = mouvementMain(main1);
		mouvement2 = mouvementMain(main2);


		// Geste
		if( (forme1 == "Pistolet" || forme1 == "Pointe") && ( main1.palmNormal[2] > 0.5 || main1.palmNormal[1] > 0.5 ) && (forme2 == "Pistolet" || forme2 == "Pointe") && ( main2.palmNormal[2] > 0.5 || main2.palmNormal[1] > 0.5 ) && main1.palmPosition[0] < main2.palmPosition[0] && mouvement1 == "Vers la droite" && mouvement2 == "Vers la gauche" ){
			geste1 = "JUL";
		}else if( forme1 == "Poing" && forme2 == "Poing" && ( main1.palmNormal[0] > 0.6 || main1.palmNormal[1] < -0.6 ) && ( main2.palmNormal[0] < -0.6 || main2.palmNormal[1] < -0.6 ) && mouvement1 == "En avant" && mouvement2 == "" ){
			geste1 = "CoupDePoingGauche";
		}else if( forme1 == "Poing" && forme2 == "Poing" && ( main1.palmNormal[0] > 0.6 || main1.palmNormal[1] < -0.6 ) && ( main2.palmNormal[0] < -0.6 || main2.palmNormal[1] < -0.6 ) && mouvement1 == "" && mouvement2 == "En avant" ){
			geste1 = "CoupDePoingDroit";
		}else if( forme1 == "Pincer" && forme2 == "Pincer" && main1.palmPosition[0] < main2.palmPosition[0]){
			geste1 = "PincerEtirement";
		}else{
			geste1 = "";
		}

	}else if(frame.hands.length == 1){ // Une main
		main1 = frame.hands[0];

		// Type
		type1 = typeMain(main1);

		// Forme
		forme1 = formeMain(main1);

		// Mouvement
		mouvement1 = mouvementMain(main1);


		// Geste
		if(forme1 == "Main plate" && main1.palmNormal[2] < -0.8 && main1.direction[1] > 0.8 && mouvement1 == "En avant"){
			geste1 = "PoussePlat";
		}else if(forme1 == "Main plate" && main1.palmNormal[2] < -0.7 && main1.direction[0] < -0.25 && main1.direction[1] > 0.3 && mouvement1 == ""){
			geste1 = "PalmeFaceGauche";
		}else if(previous1[previous1.length-1] == "PalmeFaceGauche" && forme1 == "Main plate" && main1.palmNormal[2] < -0.7 && main1.direction[0] > 0.15 && main1.direction[1] > 0.2 && mouvement1 == ""){
			geste1 = "PalmeFaceDroite";
		}else if(forme1 == "Metal" && main1.direction[2] < -0.7){
			geste1 = "MetalFront";
		}else if(forme1 == "Honneur"){
			geste1 = "DoigtdHonneur";
		}else if(forme1 == "Poing" && main1.palmNormal[1] > 0.8 && main1.direction[2] < -0.8){
			geste1 = "PoingHautFerme";
		}else if(forme1 == "Main plate" && main1.palmNormal[1] > 0.8 && main1.direction[2] < -0.8){
			geste1 = "PoingHautOuvert";
		}else if(forme1 == "Main plate" && (main1.palmNormal[0] < -0.7 || main1.palmNormal[0] > 0.7) && main1.direction[2] < -0.7 && main1.palmPosition[0] > 50 && mouvement1 == "Vers la gauche"){
			geste1 = "SwipeGauche1";
		}else if(previous1[previous1.length-1] == "SwipeGauche1" && forme1 == "Main plate" && (main1.palmNormal[0] < -0.7 || main1.palmNormal[0] > 0.7) && main1.direction[2] < -0.7 && main1.palmPosition[0] < -50 && mouvement1 == "Vers la gauche"){
			geste1 = "SwipeGauche2";
		}else if(forme1 == "Main plate" && (main1.palmNormal[0] < -0.7 || main1.palmNormal[0] > 0.7) && main1.direction[2] < -0.7 && main1.palmPosition[0] < -50 && mouvement1 == "Vers la droite"){
			geste1 = "SwipeDroit1";
		}else if(previous1[previous1.length-1] == "SwipeDroit1" && forme1 == "Main plate" && (main1.palmNormal[0] < -0.7 || main1.palmNormal[0] > 0.7) && main1.direction[2] < -0.7 && main1.palmPosition[0] > 50 && mouvement1 == "Vers la droite"){
			geste1 = "SwipeDroit2";
		}else if( (previous1[previous1.length-1] == "" || previous1[previous1.length-1] == "RPSPoingBas") && forme1 == "Poing" && mouvement1 == "Vers le haut"){
			geste1 = "RPSPoingHaut";
		}else if(previous1[previous1.length-1] == "RPSPoingHaut" && forme1 == "Poing" && mouvement1 == "Vers le bas"){
			geste1 = "RPSPoingBas";
		}else if(previous1[previous1.length-1] == "RPSPoingHaut" && forme1 == "Main plate" && mouvement1 == "Vers le bas"){
			geste1 = "RPSFeuille";
		}else if(previous1[previous1.length-1] == "RPSPoingHaut" && forme1 == "Ciseaux" && mouvement1 == "Vers le bas"){
			geste1 = "RPSCiseaux";
		}else if( (previous1[previous1.length-1] == "" || previous1[previous1.length-1] == "PointeCurseur" || previous1[previous1.length-1] == "PointeCurseurClic") && forme1 == "Pointe" && main1.direction[2] < -0.8 && main1.palmPosition[2] < -50){ // (previous1[previous1.length-1] == "MetalFront" || (previous1[previous1.length-2] == "MetalFront" && previous1[previous1.length-1] == "PointeCurseur") ) && 
			geste1 = "PointeCurseurClic";
		}else if( (previous1[previous1.length-1] == "" || previous1[previous1.length-1] == "PointeCurseur" || previous1[previous1.length-1] == "PointeCurseurClic") && forme1 == "Pointe" && main1.direction[2] < -0.8 && main1.palmPosition[2] > -50){ // (previous1[previous1.length-1] == "MetalFront" || (previous1[previous1.length-2] == "MetalFront" && previous1[previous1.length-1] == "PointeCurseur") ) && 
			geste1 = "PointeCurseur";
		}else if(previous1[previous1.length-1] == "PoingHautOuvert" && forme1 == "Main plate" && main1.direction[2] < -0.2 && main1.direction[1] > 0 && main1.palmPosition[1] > 300 && main1.palmVelocity[1] > 400){ // (previous1[previous1.length-1] == "MetalFront" || (previous1[previous1.length-2] == "MetalFront" && previous1[previous1.length-1] == "PointeCurseur") ) && 
			geste1 = "SwipeBack";
		}else{
			geste1 = "";
		}
	}else{
		type1 = "";
		type2 = "";
		mouvement1 = "";
		mouvement2 = "";
		forme1 = "";
		forme2 = "";
		main1 = "";
		main2 = "";

		geste1 = "";
	}
	// Determination gestuelle dynamique si le resultat precedant n'etait pas une fonction
	
	date = new Date();
	if(tstamp < date.getTime() - 1000){ // Si le dernier geste a ete opere plus de une seconde plus tot
		for(let i = 0; i < previous1.length; i++){ // Reinit du buffer
			previous1[i] = "";
		}
		dispAction.innerText = "";
	}
	
	var g_dynamique = ""; // Buffer temporaire
	if(geste1 != "" && geste1 != previous1[previous1.length-1]){
		tstamp = date.getTime();
		
		previous1.shift(); // Enleve le premier du tableau
		previous1.push(geste1);

		for(let i = 0; i < liste_gestes.length; i++){
			let temp_list = [];
			for(let k = 0; k < liste_gestes[i].length; k++){
				temp_list.unshift(previous1[previous1.length - k - 1]);
			}
			if(temp_list.toString() == liste_gestes[i].toString()){ // Si nous avons reconnu une action
				g_dynamique = temp_list.toString();
				break;
			}
		}
	}

	if(g_dynamique != ""){
		if(g_dynamique == ["PalmeFaceGauche","PalmeFaceDroite","PalmeFaceGauche"].toString()){
			dispAction.innerText = "Action Coucou";
		}else if(g_dynamique == "JUL"){
			dispAction.innerText = "OVNI";
		}else if(g_dynamique == "PoussePlat"){
			dispAction.innerText = "Action Poussee";
		}else if(g_dynamique == ["PoingHautFerme","PoingHautOuvert"]){
			dispAction.innerText = "Action Allume";
		}else if(g_dynamique == ["PoingHautOuvert","PoingHautFerme"]){
			dispAction.innerText = "Action Eteindre";
		}else if(g_dynamique == ["CoupDePoingGauche","CoupDePoingDroit"].toString() || g_dynamique == ["CoupDePoingDroit","CoupDePoingGauche"].toString()){
			dispAction.innerText = "Action Rocky";
		}else if(g_dynamique == ["SwipeGauche1","SwipeGauche2"].toString()){
			dispAction.innerText = "Action Swipe Gauche";
		}else if(g_dynamique == ["SwipeDroit1","SwipeDroit2"].toString()){
			dispAction.innerText = "Action Swipe Droit";
		}else if(g_dynamique == ["PoingHautOuvert","SwipeBack"].toString()){
			dispAction.innerText = "Action Swipe Back";
		}else if(g_dynamique == "MetalFront"){
			dispAction.innerText = "Action Metal";
		}else if(g_dynamique == ["RPSPoingBas","RPSPoingHaut","RPSPoingBas","RPSPoingHaut","RPSPoingBas"].toString()){
			dispAction.innerText = "Action RPS Pierre";
		}else if(g_dynamique == ["RPSPoingBas","RPSPoingHaut","RPSPoingBas","RPSPoingHaut","RPSFeuille"].toString()){
			dispAction.innerText = "Action RPS Feuille";
		}else if(g_dynamique == ["RPSPoingBas","RPSPoingHaut","RPSPoingBas","RPSPoingHaut","RPSCiseaux"].toString()){
			dispAction.innerText = "Action RPS Ciseaux";
		}else if(g_dynamique == "PointeCurseurClic"){
			dispAction.innerText = "Action Clic    : [ " + main1.palmPosition[0] + " , " + main1.palmPosition[1] + "]";
		}
	}
	
	// Gestes Analogiques
	if(geste1 == "PincerEtirement"){
		let temp = 0;
		let temp2 = main2.palmPosition[0] - main1.palmPosition[0] - 150;
		if(temp2 > 0 && temp2 < 400){
			temp = temp2 / 400 * 100;
		}else if(temp2 <= 0){
			temp = 0;
		}else if(temp2 >= 0){
			temp = 100;
		}
		dispAction.innerText = "Action Etirement : Niveau " + temp + "%";
		tstamp = date.getTime();
	}else if(geste1 == "PointeCurseur"){
		dispAction.innerText = "Action Curseur : [ " + main1.palmPosition[0] + " , " + main1.palmPosition[1] + "]";
		tstamp = date.getTime();
	}
	
	dispType.innerText = type1;
	dispForme.innerText = forme1;
	dispMouvement.innerText = mouvement1;

	dispType2.innerText = type2;
	dispForme2.innerText = forme2;
	dispMouvement2.innerText = mouvement2;

	dispGeste.innerText = geste1;

	dispTest1.innerText = previous1;
	dispTest2.innerText = tstamp + " et " + date.getTime();
});

controller.connect();
