const reducer = (state={
	list:{
		defaultList:[]
	}
},action) => {
	let data = {};
	data[action.type] = action.payload;
	if(action.type == "list"){
		localStorage.list = JSON.stringify(action.payload);
	}
	return {...state,...data};
}

export default reducer;