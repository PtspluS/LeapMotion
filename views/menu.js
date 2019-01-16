$(function(){

	let listeMenus = ["tv","lampes","cams"];//liste les sous menus pour naviguer dedans
	let currentMenu = null;//donne le menu où l'on se situe

	function menuDisplay (){
		let template = $("#menuStart").html();
		$('body').append(template);
		currentMenu = -1;
	}

	function tvDisplay(){
		let template = $("#menuTv").html();
		$('body').append(template);
		currentMenu = 0;
	}

	function lampesDisplay(){
		let template = $("#menuLampes").html();
		$('body').append(template);
		currentMenu = 1;
	}

	function camDisplay(){
		let template = $("#menuCams").html();
		$('body').append(template);
		currentMenu = 2;
	}

	function moveUp(){

	}

	function moveDown(){
		if(listeMenus[currentMenu]){
			$('body').children().remove();
			menuDisplay();
		}
	}

	function moveLeft(){
		if(listeMenus[currentMenu]){
			if(currentMenu == 0){
				currentMenu = listeMenus.length()-1;
			}else{
				currentMenu--;
			}
			$('body').children().remove();
			switch(currentMenu) {
				case 0 :
					tvDisplay();
					break;
				case 1 :
					lampesDisplay();
					break;
				case 2 :
					camDisplay();
					break;
			}
		}
	}

	function moveRight(){
		if(listeMenus[currentMenu]){
			currentMenu = (currentMenu++)%listeMenus.length();
			$('body').children().remove();
			switch(currentMenu) {
				case 0 :
					tvDisplay();
					break;
				case 1 :
					lampesDisplay();
					break;
				case 2 :
					camDisplay();
					break;
			}
		}
	}

})