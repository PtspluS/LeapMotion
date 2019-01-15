var controller = new Leap.Controller({
                         enableGestures: true,
                         frameEventName: 'animationFrame'
                         });

var dispMains = document.getElementById('mains');
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

var orientation1 = {};

var previous1 = [];

var liste_gestes = [
	["PalmeFaceGauche","PalmeFaceDroite","PalmeFaceGauche"],
	["MetalFront"],
	["JUL"]
];
var liste_gestes_noms = {

};
var taille_liste_gestes = 0;
for(let i = 0; i < liste_gestes.length; i++){
	if(liste_gestes[i].length > taille_liste_gestes) taille_liste_gestes = liste_gestes[i].length;
}
for(let i = 0; i < taille_liste_gestes; i++){
	previous1.push("");
}

var formeMain = function(main){
	let fre;
	if(main.thumb.extended && main.indexFinger.extended && main.middleFinger.extended && main.ringFinger.extended && main.pinky.extended){
		fre = "Main plate";
	}else if(!main.thumb.extended && main.indexFinger.extended && !main.middleFinger.extended && !main.ringFinger.extended && main.pinky.extended){
		fre = "Metal";
	}else if(main.indexFinger.extended && !main.middleFinger.extended && !main.ringFinger.extended && !main.pinky.extended){
		fre = "Pointe";
	}else if(main.indexFinger.extended && main.middleFinger.extended && !main.ringFinger.extended && !main.pinky.extended && main.thumb.extended){
		fre = "Pistolet";
	}else{
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
	
	if(frame.hands.length >= 2){
		main1 = frame.hands[0];
		main2 = frame.hands[1];
		
		// Type
		type1 = typeMain(main1);
		if(type1 == "right"){
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
		if(forme1 == "Pistolet" && ( main1.palmNormal[2] > 0.5 || main1.palmNormal[1] > 0.5 ) && forme2 == "Pistolet" && ( main2.palmNormal[2] > 0.5 || main2.palmNormal[1] > 0.5 ) ){
			geste1 = "JUL";
		}else{
			geste1 = "";
		}
	}else if(frame.hands.length == 1){
		main1 = frame.hands[0];
		
		// Type
		type1 = typeMain(main1);
		
		// Forme
		forme1 = formeMain(main1);
		
		// Mouvement	
		mouvement1 = mouvementMain(main1);
		
		
		// Geste
		if(forme1 == "Main plate" && main1.palmNormal[2] < -0.7 && main1.direction[0] < -0.25 && main1.direction[1] > 0.3){
			geste1 = "PalmeFaceGauche";
		}else if(forme1 == "Main plate" && main1.palmNormal[2] < -0.7 && main1.direction[0] > 0.25 && main1.direction[1] > 0.3){
			geste1 = "PalmeFaceDroite";
		}else if(forme1 == "Metal" && main1.direction[2] < -0.7){
			geste1 = "MetalFront";
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
	
	
	var g_dynamique = ""; // Buffer temporaire
	if(geste1 != "" && geste1 != previous1[previous1.length-1]){
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
			alert("Action coucou");
		}else if(g_dynamique == "MetalFront"){
			alert("Action metal");
		}else if(g_dynamique == "JUL"){
			alert("OVNI");
		}
		
		/*for(let i = 0; i < previous1.length; i++){ // Reinit du buffer
			previous1[i] = "";
		}*/
	}else{
	
	}
	dispType.innerText = type1;
	dispForme.innerText = forme1;	
	dispMouvement.innerText = mouvement1;
	
	dispType2.innerText = type2;
	dispForme2.innerText = forme2;	
	dispMouvement2.innerText = mouvement2;
	
	dispGeste.innerText = geste1;
	
	dispTest1.innerText = previous1;
	dispTest2.innerText = g_dynamique;
});

controller.connect();