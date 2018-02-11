angular.module('lk_reklamodatel').controller('bannerInfoCtrl',function($stateParams,$localStorage,bannerService) {
	
	var vm = this;
	vm.showModal = false;

	vm.diagrams = {"likes":{title:"Статистика по лайкам",type:'transitions',showButtons:false,img:"heart.png",labels:[],values:[],colors:["#37951b","#e0e0e0"]},
				"gender":{title:"Распределение по полу	",type:'transitions',showButtons:true,img:"genders.png",labels:[],values:[],colors:["#37951b","#008eaa"]},
				"age":{title:"Распределение по возрасту",type:'transitions',showButtons:true,img:"age.png",labels:[],values:[],colors:["#008eaa","#37951b","#e0e0e0","#c95c36","#f7d61c"]},
				"cities":{title:"Распределение по городам",type:'transitions',showButtons:true,img:"map.png",labels:[],values:[],colors:["#008eaa","#37951b","#e0e0e0","#c95c36","#f7d61c"]}
			};

	bannerService.getBanner($stateParams.id,function(data) {
		vm.banner = data;
		vm.date_from = vm.banner.created_at;
		vm.date_to = vm.banner.current_time; // current time from server
		vm.getGraph();		
	});

	vm.getDiagram = function(which) {
		bannerService.getDiagram($stateParams.id,which,vm.diagrams[which].type,function(data) {
			var labels=[],
				values=[],
				i=0;
			for(var key in data){
				if(i>4) vm.diagrams[which].colors.push('#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));
				labels.push(key);
				values.push(data[key]);
				i++;
			}
			vm.diagrams[which].labels=labels;
			vm.diagrams[which].values=values;
			drawDiagram(which,labels,values,vm.diagrams[which].colors)
		})
	}

	vm.getDiagram('likes')
	vm.getDiagram('gender')
	vm.getDiagram('age')
	vm.getDiagram('cities')

	
	vm.getGraph = function(){
		bannerService.getGraph($stateParams.id,vm.date_from,vm.date_to,function (data) {
			vm.graphs = data;
			vm.drawnGraphs=[];
			data.graphs.ctr={values:[],label:''};
			data.graphs.ctr.label = 'CTR';
			for(var i=0;i<data.graphs.transitions.values.length;i++){
				data.graphs.ctr.values.push((data.graphs.transitions.values[i]/data.graphs.impressions.values[i])*100);
			}
			
			vm.drawGraph("transitions",'#37951b')
			vm.drawGraph("impressions",'#008eaa')
		})
	}

	vm.drawGraph = function(graphName,color) {
		var addToDrawnGraphs = true;
		vm.drawnGraphs.forEach(function(graph,i) {
			if(graph.custom_name==graphName) {
				vm.drawnGraphs.splice(i,1);
				addToDrawnGraphs = false;
				Plotly.newPlot('lk_line_graph', vm.drawnGraphs, layout,{displayModeBar: false});
			}
		})
		
		if(!addToDrawnGraphs) return;

		var trace = {
				custom_name:graphName,
				type: 'scatter',
				x: vm.graphs.days,
				y: vm.graphs.graphs[graphName].values,
				mode: 'lines',
				name: vm.graphs.graphs[graphName].label,
				line: {
					color: color,
					width: 3
				}
			};
		vm.drawnGraphs.push(trace);		
		var layout = {
			width: 850,
			height: 380,
			margin: {l: 40,r: 10, b: 50,t: 10,pad: 4}
		};

		Plotly.newPlot('lk_line_graph', vm.drawnGraphs, layout,{displayModeBar: false});
	}

	function drawDiagram(which,labels,values,colors) {
		var data = [{
			values:values,
			labels:labels,
			hoverinfo: 'label+percent',
			hole: .5,
			type: 'pie',
			textinfo:'none',
			marker: {
				colors: colors
			}
		}];

		var layout = {
			showlegend: false,
			height: 150,
			width: 150,
			margin: {l: 0,r: 0,	b: 0,t: 0,pad: 4}
		};

		Plotly.newPlot('lk_'+which+'_donut', data, layout,{displayModeBar: false});
	}

	vm.delete = function() {
		bannerService.delete([$stateParams.id]);
		window.history.back();
	}
	
})