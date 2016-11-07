'use strict';
let $list = $("#todo-list");
const render = function(data) {
	$list.html(' ');
	data.forEach(function (item) {
		let li = $('<li class="list-group-item">' + item.message + '<input  type="checkbox" class="checkbox" id="' + item.id + '"><input type="button" class = "delete" value="Delete" id="' + item.id + '"></input></li>');
		const checkbox = li.find('.checkbox');
        checkbox.prop('checked', item.completed);
		$list.append(li);
	})
};

const drawlist = function () {
	$.ajax({
		url: "/inittodos",
		type: 'get',
		dataType: 'json',
		success: function (todos) {
			render(todos);
		},
		error: function (data) {
			alert('Error searching');
		}
	})

};
drawlist();

$("#sr").on("click", function () {
	let searchtext = $('#search').val();
	$.ajax({
		url: "/searchtodo",
		type: 'get',
		dataType: 'json',
		success: function (data) {
			$list.html("");
			let localTodos = data.filter(function (obj) {
				if (obj.message.indexOf(searchtext) >= 0) {
					return obj;
				}
			});
			render(localTodos);
		},
		error: function (data) {
			alert('Error searching');
		}
	});
});

$("#sv").on("click", function () {
	let savetext = $('#save').val();
	$.ajax({
		url: "/savetodo",
		type: 'post',
		dataType: 'json',
		data: JSON.stringify({
			message: savetext,
			completed: false,
		}),
		success: function (data) {
			drawlist();
		},
		error: function (data) {
			alert('Error saving');
		}
	})
})

$(document).on('click','.delete', function(e){
	$.ajax({
		url: "/todos/" + e.target.id,
		type: 'delete',
		success: function (data) {
			drawlist();
		},
		error: function (data) {
			alert('Error deleting the item');
		}

	});
})

$(document).on('change', '.checkbox', function(e){
	const isChecked = e.target.checked;
	console.log(isChecked);
	$.ajax({
		url: "/todos/" + e.target.id,
		type: 'put',
		dataType: 'json',
		data: JSON.stringify({
			completed: isChecked
		}),
		success: function(data) {
			drawlist();
		},
		 //error: function() {
		 	//alert('Error checking the item');
		//}
	})
})