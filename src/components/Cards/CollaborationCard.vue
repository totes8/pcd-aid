<template>
  <section class="collaboration-card">
    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="section-heading">
            <Users class="section-icon" />
            <h3>Collaborating Doctors</h3>
          </div>
          <p class="section-subtitle">{{ collaborators.length }} other people have access to this case</p>
        </div>

        <button class="button button--accent share-trigger" @click="sharingOpen = !sharingOpen">
          <UserPlus2 class="button-icon" />
          Share case
        </button>
      </div>

      <div v-if="sharingOpen" class="share-composer">
        <label class="field">
          <span class="label">Doctor name</span>
          <input v-model="shareName" type="text" class="input" placeholder="Add collaborator name" />
        </label>

        <label class="field">
          <span class="label">Institution</span>
          <input v-model="shareInstitution" type="text" class="input" placeholder="Clinic or university" />
        </label>

        <label class="field">
          <span class="label">Country</span>
          <input v-model="shareCountry" type="text" class="input" placeholder="Country" />
        </label>

        <label class="field">
          <span class="label">Permission</span>
          <select v-model="sharePermission" class="input">
            <option value="Collaborator">Collaborator</option>
            <option value="View only">View only</option>
          </select>
        </label>

        <div class="share-actions">
          <button class="button button--ghost" @click="cancelShare">Cancel</button>
          <button class="button button--accent" :disabled="!canShare" @click="addCollaborator">
            Add access
          </button>
        </div>
      </div>

      <div class="collaborator-list">
        <article v-for="collaborator in collaborators" :key="collaborator.id" class="collaborator-row">
          <div class="avatar" :style="{ backgroundColor: collaborator.color }">
            {{ collaborator.initials }}
          </div>

          <div class="collaborator-main">
            <div class="collaborator-topline">
              <span class="collaborator-name">{{ collaborator.name }}</span>
              <span class="permission-pill">{{ collaborator.permission }}</span>
            </div>
            <p class="collaborator-meta">
              {{ collaborator.institution }}
              <span class="meta-sep">|</span>
              {{ collaborator.country }}
            </p>
          </div>

          <button class="row-menu" type="button" aria-label="More collaboration options">
            <MoreVertical class="menu-icon" />
          </button>
        </article>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header panel-header--stacked">
        <div class="section-heading">
          <MessageSquareMore class="section-icon" />
          <h3>Case Discussion</h3>
        </div>
      </div>

      <div class="discussion-list">
        <article v-for="message in discussion" :key="message.id" class="message-row">
          <div class="avatar avatar--message" :style="{ backgroundColor: message.color }">
            {{ message.initials }}
          </div>

          <div class="message-main">
            <div class="message-meta">
              <span class="message-author">{{ message.author }}</span>
              <span class="meta-sep">|</span>
              <span>{{ message.timestamp }}</span>
            </div>
            <p class="message-body">{{ message.body }}</p>
          </div>
        </article>
      </div>

      <div class="discussion-composer">
        <textarea
          v-model="draftMessage"
          rows="4"
          class="input discussion-input"
          placeholder="Join discussion and share your thoughts..."
        ></textarea>
        <div class="discussion-actions">
          <button class="button button--accent" :disabled="!canPost" @click="postMessage">
            <Send class="button-icon" />
            Post comment
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { MessageSquareMore, MoreVertical, Send, UserPlus2, Users } from "lucide-vue-next";

type Collaborator = {
  id: string;
  name: string;
  permission: "Collaborator" | "View only";
  institution: string;
  country: string;
  initials: string;
  color: string;
};

type DiscussionMessage = {
  id: string;
  author: string;
  timestamp: string;
  body: string;
  initials: string;
  color: string;
};

const collaborators = ref<Collaborator[]>([
  {
    id: "martina",
    name: "Martina Kovacova",
    permission: "Collaborator",
    institution: "2nd Faculty of Medicine, Charles University",
    country: "Czech Republic",
    initials: "MK",
    color: "#68b4ba",
  },
  {
    id: "evan",
    name: "Evan Smith",
    permission: "View only",
    institution: "Faculty of Clinical Medicine, Cambridge",
    country: "United Kingdom",
    initials: "ES",
    color: "#6f88e8",
  },
]);

const discussion = ref<DiscussionMessage[]>([
  {
    id: "message_1",
    author: "Evan Smith",
    timestamp: "13/10/2024 12:30",
    body: "HSVM findings look borderline to me. I would repeat sampling if symptoms remain strongly suggestive.",
    initials: "ES",
    color: "#6f88e8",
  },
  {
    id: "message_2",
    author: "Martina Kovacova",
    timestamp: "13/10/2024 14:30",
    body: "Agreed. Family history and neonatal course still make the overall picture quite suspicious despite the current test mix.",
    initials: "MK",
    color: "#68b4ba",
  },
]);

const sharingOpen = ref(false);
const shareName = ref("");
const shareInstitution = ref("");
const shareCountry = ref("");
const sharePermission = ref<Collaborator["permission"]>("Collaborator");

const draftMessage = ref("");

const canShare = computed(() => {
  return (
    shareName.value.trim().length > 0 &&
    shareInstitution.value.trim().length > 0 &&
    shareCountry.value.trim().length > 0
  );
});

const canPost = computed(() => draftMessage.value.trim().length > 0);

function initialsFromName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function cancelShare() {
  sharingOpen.value = false;
  shareName.value = "";
  shareInstitution.value = "";
  shareCountry.value = "";
  sharePermission.value = "Collaborator";
}

function addCollaborator() {
  if (!canShare.value) return;

  collaborators.value.unshift({
    id: `collab_${Date.now()}`,
    name: shareName.value.trim(),
    permission: sharePermission.value,
    institution: shareInstitution.value.trim(),
    country: shareCountry.value.trim(),
    initials: initialsFromName(shareName.value),
    color: sharePermission.value === "Collaborator" ? "#57b7a7" : "#84a2ff",
  });

  cancelShare();
}

function postMessage() {
  const body = draftMessage.value.trim();
  if (!body) return;

  discussion.value.push({
    id: `discussion_${Date.now()}`,
    author: "Janko Mrkvicka",
    timestamp: new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    body,
    initials: "JM",
    color: "#4f93f7",
  });

  draftMessage.value = "";
}
</script>

<style scoped>
.collaboration-card {
  display: grid;
  gap: 16px;
}

.panel {
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 14px;
  padding: 18px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.panel-header--stacked {
  margin-bottom: 6px;
}

.section-heading {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.section-heading h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.section-icon {
  width: 18px;
  height: 18px;
  color: var(--accent);
}

.section-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.share-trigger,
.discussion-actions .button--accent {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.button-icon {
  width: 16px;
  height: 16px;
}

.share-composer {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fafbfe;
}

.share-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.collaborator-list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.collaborator-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eef1f6;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.avatar--message {
  width: 40px;
  height: 40px;
}

.collaborator-main,
.message-main {
  min-width: 0;
}

.collaborator-topline,
.message-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.collaborator-name,
.message-author {
  font-weight: 700;
  color: #111827;
}

.permission-pill {
  padding: 3px 8px;
  border-radius: 999px;
  background: #f4f6f9;
  border: 1px solid #e6e9ef;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.collaborator-meta,
.message-meta {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.meta-sep {
  opacity: 0.6;
}

.row-menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e1e5ea;
  background: #fff;
  color: #6b7280;
  border-radius: 10px;
  cursor: pointer;
}

.row-menu:hover {
  background: var(--white-hover);
}

.menu-icon {
  width: 16px;
  height: 16px;
}

.discussion-list {
  display: grid;
  gap: 0;
  margin-top: 12px;
  padding: 0;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #eef1f6;
}

.message-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  padding: 14px 16px;
  border-top: 1px solid #eef1f6;
}

.message-row:first-child {
  border-top: none;
}

.message-body {
  margin: 10px 0 0;
  color: #4b5563;
  line-height: 1.45;
}

.discussion-composer {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fafbfe;
}

.discussion-input {
  min-height: 96px;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
}

.discussion-actions {
  display: flex;
  justify-content: flex-end;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: #6b7280;
}

.input {
  border: 1px solid #e1e5ea;
  background: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(75, 108, 255, 0.12);
}

.button {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e1e5ea;
  background: #fff;
  cursor: pointer;
}

.button:hover {
  background: var(--white-hover);
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.button--ghost {
  background: transparent;
}

.button--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.button--accent:hover {
  background: var(--accent-hover);
}

@media (max-width: 720px) {
  .panel {
    padding: 18px;
  }

  .panel-header {
    flex-direction: column;
  }

  .share-composer {
    grid-template-columns: 1fr;
  }

  .collaborator-row {
    grid-template-columns: auto 1fr;
  }

  .row-menu {
    grid-column: 2;
    justify-self: end;
  }
}
</style>
