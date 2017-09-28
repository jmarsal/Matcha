/**
 * Created by jbmar on 02/06/2017.
 */

let paths = [
	[
		// Isis Arrondo
		'https://pbs.twimg.com/profile_images/762430840726888449/FZHjotD9.jpg',
		'http://fvf-sport.fr/wp-content/uploads/2016/03/CDYzAnWW0AEmYFG.jpg',
		'http://www.sportquick.com/photos/Docimages1/173113.jpg',
		'http://images.larepubliquedespyrenees.fr/2016/02/25/56cf47cba43f5efe0fbfe842/golden/isis-arrondo-en-mode-reeducation.jpg'
	],
	[
		// Alexandra Lacrabere
		'http://static.lexpress.fr/medias_11183/w_640,h_358,c_fill,g_center/v1476433270/la-francaise-alexandra-lacrabere-exulte-apres-avoir-inscrit-un-but-face-a-la-coree-du-sud-lors-du-tournoi-de-hand-aux-jo-de-rio-le-13-aout-2016_5725751.jpg',
		'http://arvor29paysdebrest.r.a.f.unblog.fr/files/2012/03/Alex.jpg',
		'http://www.handzone.net/upload/news/79/60579_big.jpg',
		'http://www.handlfh.org/wp-content/uploads/2013/11/Lacrabere_alexandra_37_Pillaud-e1384442219445.jpg',
		'https://s-media-cache-ak0.pinimg.com/736x/20/b8/37/20b837671b09f07f843660095089ba12.jpg'
	],
	[
		// Vianney
		'https://unpoissonnommemarcel.files.wordpress.com/2016/02/2015-11-23_jl_vianney03771.jpg',
		'http://cdn2-public.ladmedia.fr/var/public/storage/images/dossiers/musique-cine-series/news/vianney-son-rendez-vous-manque-avec-celine-dion-1239143/17977913-1-fre-FR/Vianney-Son-rendez-vous-manque-avec-Celine-Dion_portrait_w674.jpg',
		'http://static.lexpress.fr/medias_10691/w_960,h_537,c_crop,x_0,y_304/w_640,h_360,c_fill,g_north/v1448972249/vianney-selfie_5474264.jpg',
		'http://resize-parismatch.ladmedia.fr/r/901,,forcex/img/var/news/storage/images/paris-match/people/insta-story-vianney-1189331/node_1189334/20215136-1-fre-FR/_1.jpg',
		'https://img1.closermag.fr/var/closermag/storage/images/article/baccalaureat-les-lyceens-s-inspire-de-vianney-qui-a-eu-5-20-727259/5706253-2-fre-FR/Baccalaureat-les-lyceens-s-inspirent-de-Vianney-qui-a-eu-5-20_exact540x405_l.jpg'
	],
	[
		// Frederic Lopez
		'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Fr%C3%A9d%C3%A9ric_Lopez_-_Monte-Carlo_Television_Festival.jpg/220px-Fr%C3%A9d%C3%A9ric_Lopez_-_Monte-Carlo_Television_Festival.jpg',
		'http://www.revue-reflets.org/wp-content/uploads/2014/01/F-lopez-site.jpg',
		'http://static.lexpress.fr/medias_11233/w_1365,h_764,c_crop,x_0,y_678/w_640,h_360,c_fill,g_north/v1479993072/rendez-vous-en-terre-inconnue-avec-melanie-doutey-et-frederic-lopez-1_5751301.jpeg',
		'http://images.programme.tv/2012/11/Fr%C3%A9d%C3%A9ric-Lopez.jpg',
		'http://backoffice.telecablesat.fr/business/img/photos/biz/news/Frederic_Lopez-1.jpg'
	],
	[
		// Yves Camdeborde
		'http://images.larepubliquedespyrenees.fr/2013/07/27/56815e22a43f5e4d409376e6/golden/yves-camdeborde.jpg',
		'https://s-media-cache-ak0.pinimg.com/736x/3c/bf/9a/3cbf9a1488f48d4dc0970ba60e000d5e.jpg',
		'http://statics.lesinrocks.com/content/thumbnails/uploads/2016/06/camdebordeok-tt-width-604-height-402-crop-0-bgcolor-000000-lazyload-0.jpg',
		'http://images.programme.tv/2015/06/yves-camdeborde-les-chefs-contre-attaquent-100-made-in-france-c-est-une-grande-supercherie-e39626634dff634b0.jpeg',
		'http://i.f1g.fr/media/figaro/805x453_crop/2015/06/12/XVMe5601572-10ea-11e5-bd70-4a31b1293659.jpg'
	],
	[
		// Angelina
		'https://www.quizz.biz/uploads/quizz/751751/4_aq48D.jpg',
		'https://www.elheraldo.co/sites/default/files/styles/width_860/public/foto/2016/12/26/angelina-jolie1.jpg',
		'http://ekladata.com/dpCV8zc2maexa6oZnKt194gqKoE.jpg',
		'https://media.giphy.com/media/129L03GxP853vW/giphy.gif',
		'https://media.giphy.com/media/ridlFwGcBgP1C/giphy.gif'
	],
	[
		// Alba
		'http://baomoi-photo-3-td.zadn.vn/15/11/25/139/18070073/9_58951.jpg',
		'https://s-media-cache-ak0.pinimg.com/736x/7e/a4/f4/7ea4f4c1dc642981407b4bfc2a47f764.jpg',
		'https://s-media-cache-ak0.pinimg.com/originals/89/48/6a/89486a05dbddb26aab6b7db4378596d6.jpg',
		'http://images.shape.mdpcdn.com/sites/shape.com/files/styles/facebook_og_image/public/media/jessica-alba-700_4.jpg',
		'https://media.giphy.com/media/3aX8uXXw6Nf6U/giphy.gif'
	],
	[
		// Madonna
		'http://cdn4.spiegel.de/images/image-546203-galleryV9-fgyc-546203.jpg',
		'http://www.topontiki.gr/sites/default/files/article/2016-12/madonna.jpg',
		'https://media.licdn.com/mpr/mpr/shrinknp_800_800/AAEAAQAAAAAAAAbNAAAAJDhlNzhjM2FkLTMwZjUtNGU3ZS05NmRmLTY5MmNiY2IwMWUzZA.png',
		'http://www.tdance.ru/upload/iblock/78f/78f504823fca515894e64f2678e611a4.jpg',
		'https://media.giphy.com/media/CobcjsgxDM3BK/giphy.gif'
	],
	[
		// Louane
		'http://v2mike.info/wp-content/uploads/2017/02/decor-de-table-anniversaire-16-saint-denis-decor-jardin-champenoux-marche-de-noel-2016-discount-rideaux-21164906-place-ahurissant-deco-zen-a-faire-bois-diy-gifi-ikea-mais.jpg',
		'http://resize2-parismatch.ladmedia.fr/r/625,417,center-middle,ffffff/img/var/news/storage/images/paris-match/brouillons/louane-se-confie-sur-ses-parents-decedes-899159/9527503-1-fre-FR/Louane-se-confie-sur-ses-parents-decedes.jpg',
		'http://minute-people.fr/upload/media/entries/2017-03/24/32-18-c357fa2885588e870d75d39c3e470058.jpg',
		'http://breakforbuzz.com/wp-content/uploads/2015/11/maxpeopleworld858298.jpg',
		'https://media.giphy.com/media/NVTaWrYVbjBZK/giphy.gif'
	],
	[
		// Jean Dujardin
		'https://s-media-cache-ak0.pinimg.com/736x/ee/c5/bd/eec5bd8f1c8964cd4810c981f2ae337c.jpg',
		'http://www.celebres.fr/wp-content/uploads/2016/04/l-acteur-jean-dujardin-800x445.jpg',
		'http://img.voi.pmdstatic.net/fit/http.3A.2F.2Fwww.2Evoici.2Efr.2Fvar.2Fvoi.2Fstorage.2Fimages.2Fmedia.2Fmultiupload-du-30-octobre-2012.2F1-jean-dujardin.2F8390024-1-fre-FR.2F1-jean-dujardin.2Ejpg/1237x693/quality/80/1-jean-dujardin.jpg',
		'http://s1.lemde.fr/image/2010/12/08/696x348/1450891_3_714b_jean-dujardin-et-marie-josee-croze-dans-le.jpg',
		'https://media.giphy.com/media/bHgMGOuZGs8SI/giphy.gif'
	]
];
module.exports = paths;
