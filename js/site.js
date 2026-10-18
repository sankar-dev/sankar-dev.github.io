(function () {
	'use strict';

	var root = document.documentElement;
	root.classList.remove('no-js');

	// Theme toggle (preference is a per-visitor convenience; storage may be unavailable)
	var toggle = document.querySelector('.theme-toggle');
	if (toggle) {
		toggle.addEventListener('click', function () {
			var current = root.getAttribute('data-theme') ||
				(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
			var next = current === 'dark' ? 'light' : 'dark';
			root.setAttribute('data-theme', next);
			try { localStorage.setItem('theme', next); } catch (e) {}
		});
	}

	// Mobile menu
	var menuBtn = document.querySelector('.menu-toggle');
	var links = document.querySelector('.nav-links');
	if (menuBtn && links) {
		menuBtn.addEventListener('click', function () {
			var open = links.classList.toggle('is-open');
			menuBtn.setAttribute('aria-expanded', String(open));
		});
		links.addEventListener('click', function (e) {
			if (e.target.tagName === 'A') {
				links.classList.remove('is-open');
				menuBtn.setAttribute('aria-expanded', 'false');
			}
		});
	}

	// Nav border on scroll
	var nav = document.querySelector('.nav');
	var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	if (!('IntersectionObserver' in window)) {
		document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
		return;
	}

	// Reveal on scroll
	var revealObserver = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				revealObserver.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
	document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

	// Active section highlight
	var navLinks = {};
	document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
		navLinks[a.getAttribute('href').slice(1)] = a;
	});
	var sectionObserver = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			var link = navLinks[entry.target.id];
			if (link && entry.isIntersecting) {
				Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove('is-active'); });
				link.classList.add('is-active');
			}
		});
	}, { rootMargin: '-45% 0px -50% 0px' });
	document.querySelectorAll('section[id]').forEach(function (s) { sectionObserver.observe(s); });
})();
