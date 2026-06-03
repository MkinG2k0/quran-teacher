import Script from 'next/script'

/** Ранняя загрузка бандла в localStorage до гидратации React. */
export function OfflineProgramBootstrap() {
	return (
		<Script id="offline-program-bootstrap" strategy="beforeInteractive">
			{`(function(){var k='quran-offline-bundle';function done(d){if(d&&d.steps&&d.steps.length){try{localStorage.setItem(k,JSON.stringify(d));window.dispatchEvent(new Event('quran-offline-bundle-ready'));}catch(e){}}}try{if(localStorage.getItem(k)){window.dispatchEvent(new Event('quran-offline-bundle-ready'));return;}fetch('/offline/program.json').then(function(r){return r.ok?r.json():null}).then(done).catch(function(){});}catch(e){}})();`}
		</Script>
	)
}
