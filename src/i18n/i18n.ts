import { createI18n } from "vue-i18n";
import { en_US } from "./lang/en_US";
import { fr_FR } from "./lang/fr_FR";
import { en_PI } from "./lang/en_PI";

export const messages = {
	en_US,
	fr_FR,
	en_PI,
};

import { Component, defineAsyncComponent } from "vue";
import { LS_KEYS } from "@/store/lskeys";

const FlagUS = defineAsyncComponent(() => import("@components/base/flags/US.vue"));
const FlagFR = defineAsyncComponent(() => import("@components/base/flags/FR.vue"));
const FlagPirate = defineAsyncComponent(() => import("@components/base/flags/PIRATE.vue"));

export const langs = {
	en_US: {
		name: "English (United States)",
		icon: FlagUS,
	},
	fr_FR: {
		name: "French (France)",
		icon: FlagFR,
	},

	en_PI: {
		name: "English (Pirate)",
		icon: FlagPirate,
	},
} as {
	[key: string]: {
		name: string;
		icon: Component | null;
	};
};

const getBrowserLocale = () => {
	let locale: string;
	const setting = localStorage.getItem(LS_KEYS.LOCALE);
	if (setting) {
		locale = setting;
	} else {
		const navigatorLocale = navigator.languages !== undefined ? navigator.languages[0] : navigator.language;

		if (!navigatorLocale) {
			return undefined;
		}

		locale = navigatorLocale;
	}

	locale = locale.trim().replace("-", "_").toLowerCase();

	if (!langs[locale]) {
		return "en_US";
	}

	return locale;
};

export const i18n = createI18n({
	legacy: false,
	locale: getBrowserLocale(),
	fallbackLocale: "en_US",
	silentTranslationWarn: true,
	silentFallbackWarn: true,
	warnHtmlMessage: false,
	allowComposition: true,
	messages,
});
