# league-of-legends-coop-bot

[J'ai parlé de ce code dans cette vidéo : https://www.youtube.com/watch?v=9djadlNYh3Q](https://www.youtube.com/watch?v=9djadlNYh3Q)

Prérequis :
- Git installé et mis dans le PATH
- Node JS installé et mis dans le PATH
- Python 3 installé et mis dans le PATH
- Utiliser un écran 1280x1024
- Paramétrer son client LOL en 1024x576
- Paramétrer sa résolution LOL en game en 1280x720

([Pour mettre un programme dans le path, si jamais le logiciel d'installation le fait pas pour vous (normalement il le fait), j'ai cette partie d'un de mes tutos qui montre comment le faire (en utilisant l'exemple de PHP)](https://youtu.be/Ae-XwrvYuPw?t=91))


Pour l'installer, ouvrir une console dans le dossier où on veut installer le bot, et executer les commandes suivantes :
```
git clone https://github.com/pierreminiggio/league-of-legends-coop-bot
cd league-of-legends-coop-bot
```

```
npm install -g windows-build-tools
npm install
```

- Lancer LOL
- Appuyer sur "Play" et sur "Coop VS IA"
- Paramétrer les résolution d'écrans et en jeu (décrites plus haut)

Executer la commande : 
```
node index.js
```
Le bot devrait normalement commencer à partir en game.

Attention, ce code n'est pas maintenu et sert juste de démonstration de ce qui est possible de faire avec du code, une mise à jour que ferait Riot Games pourrait le casser à tout moment.

Cette base de code est disponible pour but éducatif est à utiliser à vos propres risques. Je ne suis en aucun cas responsable.
