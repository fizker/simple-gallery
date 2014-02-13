;(function(global) {
global.gallery =
	{ init: init
	}

var createContainer = document.createElement('div')
var concat = Array.prototype.concat
var slice = Array.prototype.slice

function init(imageContainer) {
	var $lightbox = $.create('<div class="image-lightbox"></div>')
	var currentImage = -1
	var $images = $(imageContainer || 'body').find('.image')
	$(document).on('keyup', handleKeyDown)
	$images.on('click', function(event) {
		event.preventDefault()
		var link = this
		currentImage = $images.indexOf(link)
		showCurrentImage()
	})
	$lightbox.appendTo(document.body)

	function handleKeyDown(event) {
		var esc = 27
		var arrowLeft = 37
		var arrowRight = 39
		switch(event.keyCode) {
			case esc:
				closePopup()
				break
			case arrowLeft:
				currentImage--
				setNextImage()
				break
			case arrowRight:
				currentImage++
				setNextImage()
				break
			default:
				return
		}
		event.preventDefault()
	}

	function closePopup() {
		$lightbox.html('')
	}

	function setNextImage() {
		if(currentImage < 0) currentImage = $images.length - 1
		if(currentImage >= $images.length) currentImage = 0
		showCurrentImage()
	}

	function showCurrentImage() {
		link = $images[currentImage]
		$lightbox.html('<img src="' + link.href + '">')
	}
}

function $(selector, scope) {
	var arr = typeof(selector) == 'string'
		? (scope || document).querySelectorAll(selector)
		:  [ selector ]
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
