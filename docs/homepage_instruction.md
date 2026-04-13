<!-- 
This is the home page state after the successful parse of the instagram data. the tile for which the data is not available will be grey  -->

<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>WhoLeft Insights Dashboard V1</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee2b7c",
                        "secondary": "#5D5FEF",
                        "background-light": "#f2f2f7",},
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    boxShadow: {
                        'ios': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
                    }
                },
            },
        }
    </script>
<style>
        body {-webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light font-display text-gray-900 pb-10">
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-5 py-4">
<div class="flex items-center justify-between mb-0.5">
<h1 class="text-2xl font-bold tracking-tight text-primary">Who Left? Now You Know</h1>
</div>
<p class="text-sm text-gray-500 font-medium">No login. Just insights.</p>
</header>
<main class="flex flex-col gap-5 p-5 max-w-md mx-auto">
<div class="bg-white rounded-2xl shadow-ios overflow-hidden">
<div class="p-5 pb-2">
<div class="flex justify-between items-start">
<div>
<h2 class="text-gray-500 text-sm font-semibold uppercase tracking-wider">Non-Followers</h2>
<div class="flex items-baseline gap-2 mt-1">
<span class="text-4xl font-bold text-gray-900">1,240</span>
<span class="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">+12 today</span>
</div>
</div>
<div class="bg-gray-50 p-2 rounded-full">
<span class="material-symbols-outlined text-gray-400">person_off</span>
</div>
</div>
</div>
<div class="px-5">
<div class="divide-y divide-gray-100">
<div class="flex items-center justify-between py-3">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-cover bg-center border border-gray-100" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrq4AdRKM2yb4kQt2AxjbvvRa1N1rYLrE4FRJYG4aDY1_bo8rpM2bA1m0EUrBKUP0y3p3V4YicMBRUMR0EwvGlSAFlGK02Hbn1NLJDe_W9ouj6bREbM_TxtUIM3UjWGGNJoGMWqxjYi7p40F8eB3a0a_Ax4HiW2UyJUHfmllGezz3rgddNuKCQ-rTJygfqgqQLpnxtorsiPMuO2d9Gm8PugcWbGHYRhw2sGaADQhB1yKIR8McMAIS3KfN81-FFBffIrCVnWasfY3I')"></div>
<div>
<p class="text-sm font-semibold text-gray-900">alex_design</p>
<p class="text-xs text-gray-400">Following you</p>
</div>
</div>
<button class="text-xs font-semibold px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Unfollow
                        </button>
</div>
<div class="flex items-center justify-between py-3">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-cover bg-center border border-gray-100" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1yj_tcA4rDHEsWlYjiYcuEZuiRqzi59RhrNaEiacZnL3qbS4Z3m4Dk2oOqlOWDXWJPNXR2-Cr6yKAyhP-pR0nCVw3daNbGX_i4Z5O3PIMsN3mwGw8zgcEZcLxsy5dSrNa_hv9RLBRNPwxgnGBTC94NH963gIWDd0cveSLEKohILklXD1sEK4VhAO7mrVIDDPWfZjEZE8YwdHmjxmjP7mAJk8-Z19r9D-3CwQposMmb-1IxFBcnAZAIBERtwZHgSRg_FmJOsZuQMs')"></div>
<div>
<p class="text-sm font-semibold text-gray-900">sarah_travels</p>
<p class="text-xs text-gray-400">Following you</p>
</div>
</div>
<button class="text-xs font-semibold px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Unfollow
                        </button>
</div>
<div class="flex items-center justify-between py-3">
<div class="flex items-center gap-3">
<div class="h-10 w-10 rounded-full bg-cover bg-center border border-gray-100" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCijnlMd3NTxVC42o96AttTvn6YB3j3uUjZFxNkwCmI8m8QISF0AejCvsuUnrAxN6XViQ2ptK-lxGpY6mIzlA5jzcfWo8uIFNWFJrKkuXMlrkg2vYgQscJCOQrQvn2htIb48l_U2f0_42CzfdS00r3OVibJydArfBLHlPOshzz3sf5x6GaaFJs0_RFkbXLls7GXZyYRgeeTejDcDAmpzNPtzspSZzAYjOI_BRhy9SFZPFgDR3sV5cQKV3nnPpnsn9_Xby9uIe-OjQI')"></div>
<div>
<p class="text-sm font-semibold text-gray-900">mark_studio</p>
<p class="text-xs text-gray-400">Following you</p>
</div>
</div>
<button class="text-xs font-semibold px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Unfollow
                        </button>
</div>
</div>
</div>
<div class="p-4 bg-gray-50/50 border-t border-gray-100">
<button class="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-sm active:scale-[0.98] transition-transform">
                    See All Non-Followers
                </button>
</div>
</div>
<div class="bg-white rounded-2xl shadow-ios p-5">
<h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-xl">ads_click</span>
                Ad Insights
            </h3>
<div class="mb-6">
<div class="flex justify-between text-xs font-semibold text-gray-500 mb-2">
<span>Ads vs. Posts Viewed</span>
<span>32% Ads</span>
</div>
<div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
<div class="h-full bg-primary" style="width: 32%"></div>
<div class="h-full bg-gray-300" style="width: 68%"></div>
</div>
<div class="flex justify-between mt-2 text-[10px] text-gray-400">
<div class="flex items-center gap-1">
<div class="w-2 h-2 rounded-full bg-primary"></div>
                        Ads (420)
                    </div>
<div class="flex items-center gap-1">
<div class="w-2 h-2 rounded-full bg-gray-300"></div>
                        Posts (890)
                    </div>
</div>
</div>
<div>
<p class="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">Top Ad Categories</p>
<div class="flex flex-wrap gap-2">
<span class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold border border-blue-100">Tech</span>
<span class="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold border border-purple-100">Fashion</span>
<span class="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-semibold border border-orange-100">Design</span>
<span class="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold border border-green-100">Finance</span>
<span class="px-3 py-1.5 bg-pink-50 text-pink-600 rounded-lg text-xs font-semibold border border-pink-100">Lifestyle</span>
</div>
</div>
</div>
<div class="bg-white rounded-2xl shadow-ios p-5">
<div class="flex justify-between items-center mb-2">
<h3 class="text-base font-bold text-gray-900">Follower Growth</h3>
<span class="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
</div>
<div class="h-40 w-full relative">
<svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 150">
<defs>
<linearGradient id="gradient-growth" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#ee2b7c" stop-opacity="0.1"></stop>
<stop offset="100%" stop-color="#ee2b7c" stop-opacity="0"></stop>
</linearGradient>
</defs>
<path d="M0 150 L0 120 C 50 120, 50 100, 100 90 C 150 80, 150 40, 200 50 C 250 60, 250 20, 300 10 L 300 150 Z" fill="url(#gradient-growth)"></path>
<path d="M0 120 C 50 120, 50 100, 100 90 C 150 80, 150 40, 200 50 C 250 60, 250 20, 300 10" fill="none" stroke="#ee2b7c" stroke-linecap="round" stroke-width="2.5"></path>
<circle cx="200" cy="50" fill="white" r="4" stroke="#ee2b7c" stroke-width="2"></circle>
</svg>
</div>
<div class="flex justify-between mt-0 text-xs text-gray-400 font-medium">
<span>Jan</span>
<span>Feb</span>
<span>Mar</span>
<span>Apr</span>
</div>
</div>
<div class="bg-white rounded-2xl shadow-ios p-5">
<div class="flex justify-between items-center mb-6">
<h3 class="text-base font-bold text-gray-900">Engagement Persona</h3>
<button class="text-gray-400 hover:text-gray-600">
<span class="material-symbols-outlined text-lg">info</span>
</button>
</div>
<div class="relative w-full aspect-square max-w-[280px] mx-auto">
<svg class="w-full h-full" viewBox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="40" stroke="#e5e7eb" stroke-width="0.5"></circle>
<circle cx="50" cy="50" fill="none" r="25" stroke="#e5e7eb" stroke-width="0.5"></circle>
<line stroke="#e5e7eb" stroke-width="0.5" x1="50" x2="50" y1="10" y2="90"></line>
<line stroke="#e5e7eb" stroke-width="0.5" x1="10" x2="90" y1="50" y2="50"></line>
<polygon fill="rgba(238, 43, 124, 0.2)" points="50,15 80,50 50,75 25,50" stroke="#ee2b7c" stroke-linejoin="round" stroke-width="2"></polygon>
<circle cx="50" cy="15" fill="#ee2b7c" r="2"></circle>
<circle cx="80" cy="50" fill="#ee2b7c" r="2"></circle>
<circle cx="50" cy="75" fill="#ee2b7c" r="2"></circle>
<circle cx="25" cy="50" fill="#ee2b7c" r="2"></circle>
<text fill="#6b7280" font-size="4" font-weight="600" text-anchor="middle" x="50" y="8">Likes</text>
<text fill="#6b7280" font-size="4" font-weight="600" text-anchor="start" x="92" y="52">Comments</text>
<text fill="#6b7280" font-size="4" font-weight="600" text-anchor="middle" x="50" y="96">Saves</text>
<text fill="#6b7280" font-size="4" font-weight="600" text-anchor="end" x="8" y="52">DMs</text>
</svg>
</div>
<p class="text-center text-xs text-gray-500 mt-2">Balanced engagement profile</p>
</div>
</main>
<div class="h-6"></div>

</body></html>