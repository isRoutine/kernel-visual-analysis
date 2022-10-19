/*************************************************
*	INDEX MODULE
*	18.10.2022
*	Gianluca Farinaccio
*************************************************/


import {Repository} from './repository.js';
import {clusteringBySubsystems, clusteringBySubsystem, openCluster} from './clustering.js';


// const 	REPOSITORY = new Repository();
const	NETWORK_DIV = "network";
const	STATUS_DIV = "status";
// let		network = null;


async function init(entryPoint){
	REPOSITORY = new Repository();

	status(STATUS_DIV, "fetching data for entry point: " + entryPoint);
	console.log("fetching data for entry point: " + entryPoint);
	await REPOSITORY.fetchData(entryPoint);
	
	status(STATUS_DIV, "fetched data for entry point: " + entryPoint);
	console.log("fetched data for entry point: " + entryPoint);
	let container = document.getElementById(NETWORK_DIV);

	console.log("network creation...");
	network = new vis.Network(container, REPOSITORY.networkData, REPOSITORY.options);
	status(STATUS_DIV, "network created from entry point: " + entryPoint);
	console.log("network created from entry point: " + entryPoint);	


	console.log("clustering subsystems...");	
	clusteringBySubsystems(network, REPOSITORY.subsystems);
	console.log(REPOSITORY.edges.get());
	status(STATUS_DIV, "subsystems clustered...");	


	// 	CANVAS EVENTS
    network.on("doubleClick", function(params) {
    	if(params.nodes[0] == null) return;
    	let node = REPOSITORY.nodes.get(params.nodes[0]);
    	if(node != null)
    		clusteringBySubsystem(network, node.group);
	});

    network.on("hold", (params) => openCluster(network, params.nodes[0])); 
    network.on("click", (params) => console.log(params));   
}



/********************************
*	EVENTS
********************************/
window.onload = () => {
	let entryPoint = document.getElementById('symname').textContent;
	init(entryPoint);
};

document.getElementById("stop").onclick = function() { network.stopSimulation() };
document.getElementById("start").onclick = function() { network.startSimulation() };



/********************************
*	FUNCTIONS
* 
********************************/

function status(elementID, text){
	document.getElementById(elementID).innerText = "STATUS => [ " + text + " ]";
}

