// import 'bootstrap/dist/css/bootstrap.css';
import '@/styles/globals.css';
import Head from 'next/head';
import localFont from 'next/font/local';
import { useEffect, useState } from "react";
import System from '@/contexts/System.js';
import { NextUIProvider } from "@nextui-org/react";
import { detectingDarkMode, getStoredTheme, setStoredTheme } from '@/js/theme.js';
// const { auth, setAuth, claims, setClaims, isLoading: isAuthLoading } = useAuth();

const jf_openhuninn = localFont({ src: '../public/fonts/jf-openhuninn-2.0.ttf' })

export default function MyApp({ Component, pageProps }) {
	const [theme, setTheme] = useState("light");

	function setThemeAndSetClass(theme) {
		if (theme == "dark") {
			document.body.classList.add("dark");
			document.body.classList.add("text-foreground");
			document.body.classList.add("bg-background");
		} else {
			document.body.classList.remove("dark");
			document.body.classList.remove("text-foreground");
			document.body.classList.remove("bg-background");
		}
		setTheme(theme);
	}

	useEffect(() => {
		// require("bootstrap/dist/js/bootstrap.bundle.min.js");
		function getTheme() {
			const storedTheme = getStoredTheme();
			if (storedTheme) return storedTheme;
			const theme = detectingDarkMode();
			setStoredTheme(theme);
			return theme;
		}
		const theme = getTheme();
		setThemeAndSetClass(theme);
	}, []);

	return (
		<NextUIProvider>
			<System value={{ theme, setTheme: setThemeAndSetClass }}>
				<div className={jf_openhuninn.className}>
					<Head>
						<link rel="apple-touch-icon" sizes="180x180" href="/favicon_package/apple-touch-icon.png?v=4.0" />
						<link rel="icon" type="image/png" sizes="32x32" href="/favicon_package/favicon-32x32.png?v=4.0" />
						<link rel="icon" type="image/png" sizes="16x16" href="/favicon_package/favicon-16x16.png?v=4.0" />
						<link rel="manifest" href="/favicon_package/site.webmanifest?v=4.0" />
						<link rel="mask-icon" href="/favicon_package/safari-pinned-tab.svg?v=4.0" color="#ffb11b" />
						<link rel="shortcut icon" href="/favicon_package/favicon.ico?v=4.0" />
						<meta name="apple-mobile-web-app-title" content="每日文大" />
						<meta name="application-name" content="每日文大" />
						<meta name="msapplication-TileColor" content="#ffffff" />
						<meta name="msapplication-TileImage" content="/favicon_package/mstile-144x144.png?v=4.0" />
						<meta name="msapplication-config" content="/favicon_package/browserconfig.xml?v=4.0" />
						<meta name="theme-color" content="#FFB11B" />
						<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
					</Head>
					<Component {...pageProps} fontClass={jf_openhuninn.className} />
				</div>
			</System>
		</NextUIProvider>
	)
}