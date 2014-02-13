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
				setPreviousImage()
				break
			case arrowRight:
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

	function setPreviousImage() {
		currentImage--
		showCurrentImage()
	}

	function setNextImage() {
		currentImage++
		showCurrentImage()
	}

	function showCurrentImage() {
		if(currentImage < 0) currentImage = $images.length - 1
		if(currentImage >= $images.length) currentImage = 0

		link = $images[currentImage]

		$lightbox.html(''
			+ '<div class="image-container">'
				+ '<button class="btn-close icon-close"></button>'
				+ '<div>'
					+ '<span class="btn-prev"><span class="icon-prev"></span></span>'
					+ '<img src="' + link.href + '">'
					+ '<span class="btn-next"><span class="icon-next"></span></span>'
				+ '</div>'
				+ '<a class="btn-download" href="' + link.href + '"><span class="icon-download"></span> download</a>'
			+ '</div>'
		)
		$lightbox.find('.btn-close').on('click', closePopup)
		$lightbox.find('.btn-prev').on('click', setPreviousImage)
		$lightbox.find('.btn-next').on('click', setNextImage)
	}
}

function $(selector, scope) {
	var arr = typeof(selector) == 'string'
		? (scope || document).querySelectorAll(selector)
		: [ selector ]
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
