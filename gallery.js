;(function(global) {
global.gallery =
	{ init: init
	}

var createContainer = document.createElement('div')
var concat = Array.prototype.concat
var slice = Array.prototype.slice

function init(imageContainer) {
	var $lightbox = $.create('<div class="image-lightbox"></div>')
	$(imageContainer || 'body').find('.image').on('click', function(event) {
		event.preventDefault()
		var link = this
		$lightbox.html('<img src="' + link.href + '">')
	})
	$lightbox.appendTo(document.body)
}

function $(selector, scope) {
	var arr = (scope || document).querySelectorAll(selector)
	return extendArray(arr)
}

$.create = function(html) {
	createContainer.innerHTML = html
	var elm = createContainer.children[0]
	return extendArray([elm])
}

function extendArray(arr) {
	arr = slice.call(arr)

	arr.on = function(event, fn) {
		this.forEach(function(element) {
			element.addEventListener(event, fn)
		})
		return this
	}

	arr.find = function(selector) {
		return extendArray(concat.apply([], this.map(function(el) {
			return $(selector, el)
		})).filter(uniq))
	}

	arr.html = function(html) {
		arr.forEach(function(element) {
			element.innerHTML = html
		})
		return arr
	}

	arr.appendTo = function(elm) {
		arr.forEach(function(element) {
			elm.appendChild(element)
		})
		return arr
	}

	return arr
}

function uniq(elm, idx, arr) {
	return ~arr.indexOf(elm, idx)
}

})(this)
