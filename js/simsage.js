
// create a random guid
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// get or create a session based client id for SimSage usage
function getClientId() {
    let clientId = localStorage.getItem("simsage_client_id");
    if (!clientId || clientId.length === 0) {
    	clientId = guid();
    	localStorage.setItem("simsage_client_id", clientId);
    }
    return clientId;
}


// perform a query and return the result to the callback
function query(server, question, result_callback) {
    const data = {
    	customerId: getClientId(),
	    query: question
	};
    jQuery.ajax({
        headers: {'Content-Type': 'application/json'},
        'type': 'POST',
        'url': server + '/query',
        'data': JSON.stringify(data),
        'dataType': 'json',
        'success': function(queryResultList) {
        	let display_text = '';
        	// pick the top result
            if (queryResultList.length > 0) {
                const item = queryResultList[0];
                if (item && item.actionList && item.actionList.length > 0) {
	                const actions = item.actionList;
	                for (let i = 0; i < actions.length; i++) {
	                    const action = actions[i];
	                    if (action['action'] === 'browser.write') {
	                        for (let j = 0; j < action['parameters'].length; j++) {
	                            const param = action['parameters'][j];
	                            if (display_text.length > 0) {
	                            	display_text += ' ';
	                            }
	                            display_text += param;
	                        }
	                    }
	                }
	            }
            }
            // no results?
            if (display_text.length === 0) {
            	display_text = 'Sorry, I do not understand your question.';
            }
            if (result_callback) {
            	result_callback(display_text);
            }

        }})
        .fail(function(err) {
            console.error(JSON.stringify(err));
            alert( "error: " + JSON.stringify(err));
        });

}
