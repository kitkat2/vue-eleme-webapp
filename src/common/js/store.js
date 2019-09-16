export function saveToLocal(id,key,value) {
	let seller = window.localStorage.__seller_;
	if(!seller) {
		seller = {};
		seller[id] = {};		
	}else {
		seller = JSON.parse(seller);
		if(!seller[id]){
			seller[id] = {};
		}
	}
	seller[id][key] = value;
	window.localStorage.__seller_ = JSON.stringify(seller);
	
};

export function loadFromLocal(id, key, def){
	let seller = window.localStorage.__seller_;
	if(!seller){
		return def;
	}
	seller = JSON.parse(seller);
	if(!seller[id]){
		return def;
	}
	let ret = seller[id][key];
	return ret || def;

}