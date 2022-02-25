import { ActiveEmote, EmoteSet } from "@/structures/EmoteSet";
import { User } from "@/structures/User";
import { defineStore } from "pinia";

export interface State {
	user: User | null;
	activeEmotes: Map<string, ActiveEmote>;
	editableEmoteSets: Map<string, EmoteSet>;
	defaultEmoteSetID: string | null;
}

export const useActorStore = defineStore("actor", {
	state: () =>
		({
			user: null,
			activeEmotes: new Map<string, ActiveEmote>(),
			editableEmoteSets: new Map<string, EmoteSet>(),
			defaultEmoteSetID: localStorage.getItem("default_emote_set_id"),
		} as State),
	getters: {
		channelEmoteSets(): EmoteSet[] {
			if (!this.user) {
				return [];
			}

			const a = this.user.connections?.map((uc) => uc.emote_set_id).filter((s) => s) as string[];
			const result = [] as EmoteSet[];
			for (const es of this.editableEmoteSets.values()) {
				if (a.includes(es.id)) {
					result.push(es);
				}
			}
			return result;
		},
		defaultEmoteSet(): EmoteSet | null {
			if (!this.user) {
				return null;
			}

			return this.defaultEmoteSetID ? this.editableEmoteSets.get(this.defaultEmoteSetID) ?? null : null;
		},
	},
	actions: {
		setUser(user: User) {
			this.user = user;
		},
		updateUser(u: User) {
			if (!this.user) {
				return;
			}
			const user = this.user;
			if (u.username !== user?.username) {
				user.username = u.username;
			}
			if (u.display_name !== user.display_name) {
				user.display_name = u.display_name;
			}
			if (u.email !== user.email) {
				user.email = u.email;
			}
			user.connections = u.connections;
			if (typeof u.tag_color === "number") {
				user.tag_color = u.tag_color;
			}
			if (Array.isArray(u.roles)) {
				user.roles = u.roles;
			}
		},
		updateActiveEmotes() {
			this.activeEmotes.clear();
			if (this.defaultEmoteSet && Array.isArray(this.defaultEmoteSet.emotes)) {
				this.defaultEmoteSet.emotes.forEach((ae) => this.activeEmotes.set(ae.id, ae));
			}
		},
		setDefaultEmoteSetID(id: string) {
			this.activeEmotes.clear();
			if (id) {
				localStorage.setItem("default_emote_set_id", id);
				this.defaultEmoteSetID = id;
				this.defaultEmoteSet?.emotes.forEach((ae) => this.activeEmotes.set(ae.id, ae));
			} else {
				localStorage.removeItem("default_emote_set_id");
				this.defaultEmoteSetID = "";
			}
		},

		// Editable Emote Sets
		addEmoteSet(set: EmoteSet) {
			this.editableEmoteSets.set(set.id, set);
		},
		updateEmoteSet(d: EmoteSet) {
			const set = this.getEmoteSet(d.id);
			if (!set) {
				return;
			}
			if (Array.isArray(d.emotes)) {
				set.emotes = d.emotes;
			}
			this.editableEmoteSets.set(set.id, set);
			this.updateActiveEmotes();
		},
		removeEmoteSet(id: string) {
			this.editableEmoteSets.delete(id);
		},
		getEmoteSet(id: string): EmoteSet | null {
			return this.editableEmoteSets.get(id) ?? null;
		},
		getActiveEmoteInSet(setID: string, emoteID: string): ActiveEmote | null {
			return this.editableEmoteSets.get(setID)?.emotes.filter((ae) => ae.id === emoteID)[0] ?? null;
		},
	},
});
