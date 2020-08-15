<!-- Team Details Card-->
<!-- Displays detailed team data in a card -->
<template>
  <span style="width:100%;">
    <v-hover v-slot:default="{ hover }">
      <!-- Main Card -->
      <v-card :elevation="hover ? 16 : 2">
        <v-row class="ma-0">
          <v-col cols="12" md="2" class="flex-row-end pa-0">
            <span class="flex-row ma-0">
              <!-- Team Logo -->
              <v-avatar size="7rem" style="overflow:hidden;">
                <v-img :src="logoSrc" />
                <CloudinaryUploader
                  v-if="editing"
                  cloudName="karo"
                  uploadPreset="karo_unsigned"
                  :sources="['local', 'url']"
                  :showAdvancedOptions="false"
                  :cropping="true"
                  :multiple="false"
                  defaultSource="local"
                  @completed="uploaded"
                />
              </v-avatar>
            </span>
          </v-col>
          <v-col cols="12" md="10">
            <!-- Team Name -->
            <v-card-title v-if="!editing">{{ team.name }}</v-card-title>
            <v-text-field
              v-if="editing"
              label="Team Name"
              v-model="team.name"
              style="width: 100%;"
            />
            <!-- Team Description -->
            <v-card-subtitle v-if="!editing">
              {{ team.description }}
            </v-card-subtitle>
            <v-textarea
              v-if="editing"
              label="Team Description"
              v-model="team.description"
              style="width: 100%;"
            />
          </v-col>
        </v-row>

        <ConfirmDeleteDialog
          heading="Wait! Are you Sure?"
          body="Deleting this team will remove all team members, stop all projects and delete all related data premanently. Are you sure you want to proceed?"
          :validationText="team.name"
          :showProp="deletingTeam"
          @passBack="confirmationReceived"
        />

        <v-card-actions>
          <!-- Edit Team -->
          <span v-if="!editing">
            <v-btn v-if="owned" text outlined @click="setupEditingEnv()">
              <v-icon left>create</v-icon>
              Edit
            </v-btn>
          </span>
          <span v-if="editing">
            <v-btn v-if="owned" text outlined @click="updateChanges()">
              <v-icon left> check </v-icon>
              Done
            </v-btn>
            <v-btn v-if="owned" text outlined @click="cancel()">
              <v-icon left> clear </v-icon>
              Cancel
            </v-btn>
            <v-btn v-if="editing" text outlined @click="deleteTeam()">
              <v-icon>delete_forever</v-icon>
            </v-btn>
          </span>

          <v-spacer></v-spacer>
          <!-- View team members -->
          <v-btn text @click="showMembers = !showMembers" :disabled="editing">
            Members
            <v-icon right>{{
              showMembers ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card-actions>

        <section v-if="!editing">
          <v-list-item
            v-show="showMembers"
            v-for="member in members"
            :key="member.userid"
            class="border-list-item"
          >
            <v-row class="mx-0 pl-2">
              <v-col cols="12" md="4" class="ma-0 pa-0 flex-start">
                <!-- Member name -->
                <span class="member-name">{{ member.name }}</span>
              </v-col>
              <v-col cols="12" sm="8" md="4" class="ma-0 pa-0 member_email">
                <!-- Member email -->
                <span
                  :class="
                    `${darkMode ? 'dark-email' : 'light-email'} member-email`
                  "
                  >{{ member.email }}</span
                ></v-col
              >
              <v-col cols="12" sm="4" class="ma-0 pa-0 member_actions">
                <!-- Member Role -->
                <v-chip>{{ member.role }}</v-chip>
                <!-- View Profile -->
                <v-btn
                  icon
                  class="mx-2"
                  @click="goToProfile('/profile/', member.userid)"
                >
                  <v-icon>person</v-icon>
                </v-btn>
                <!-- Message this user -->
                <v-btn v-if="!editing" icon class="mx-2">
                  <v-icon>message</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </section>
      </v-card>
    </v-hover>
    <v-card v-if="editing" class="px-2 py-2 my-3">
      <v-card-text
        class="red darken-4 grey--text text--lighten-4 px-3 subtitle-1"
        v-if="errors"
      >
        <v-icon left class="grey--text text--lighten-4">warning</v-icon>
        {{ errors }}
      </v-card-text>
      <v-row>
        <v-col cols="12" class="flex-row">
          <v-text-field
            ref="email"
            v-model="email"
            label="E-Mail"
            class="px-3"
            style="width:80%;"
            required
          ></v-text-field>
          <v-btn outlined icon large color="grey" @click="addMember()">
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left" style="width: 80%;">Email</th>
              <th class="text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, i) in members" :key="member.id">
              <td class="text-left">
                <v-btn text class="pa-0 ma-0" @click="removeMember(i)">
                  <v-icon class="red--text">remove_circle</v-icon>
                </v-btn>
                <v-chip pill>
                  <v-avatar left :color="members[i].color">
                    {{ member.email[0] }}
                  </v-avatar>
                  {{ member.email }}
                </v-chip>
              </td>
              <td class="text-left">
                <v-combobox
                  v-model="members[i].role"
                  :items="roleNames"
                ></v-combobox>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </span>
</template>

<style lang="scss" scoped>
.flex-column {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
}
.flex-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.member_email {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}

@media only screen and (min-width: 960px) {
  .member_email {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
  }
}

.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}

.member_actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.flex-row-end {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.member-name {
  font-size: 1.2rem;
  font-weight: 400;
  margin-right: 0.2rem;
}

@media only screen and (min-width: 600px) {
  .member_actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  .mobile-pad {
    padding-top: 0.5rem;
  }
}
.mobile-pad {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}

.member-email {
  font-size: 0.8rem;
  text-transform: uppercase;
  border-radius: 0.2rem;
  letter-spacing: 0.1rem;
  padding: 0.1rem 0.3rem;
}

.dark-email {
  background-color: #303030;
}

.light-email {
  background-color: #ddd;
}
.border-list-item {
  max-width: 100%;
  border: 1px solid #303030;
  border-left-width: 0;
  border-right-width: 0;
  border-bottom-width: 0;
  padding-left: 0.3rem;
}
</style>

<script>
/*eslint-disable no-console*/
import router from "@/router/index";
import feathersClient from "@/feathers-client";
import store from "@/store/index";
import ConfirmDeleteDialog from "@/components/dialogs/ConfirmDeleteDialog";
import CloudinaryUploader from "@/components/uploaders/CloudinaryUploader";

export default {
  name: "TeamDetailsCard",
  props: {
    initlogoSrc: String,
    initteam: Object,
    /*
        id: String,
        profilePicUrl: String,
        name: String,
        description: String,
        createdAt: String,
        updatedAt: String
      */
    initmembers: Array,
    /*
        userid: String,
        name: String,
        email: String,
        role: String,
        fav: Boolean
      */
    initowned: Boolean,
    initprojects: Array
  },
  components: {
    ConfirmDeleteDialog,
    CloudinaryUploader
  },
  data: () => ({
    showMembers: false,
    editing: false,
    deletingTeam: false,
    email: "",
    members: [],
    team: {},
    logoSrc: "",
    owned: null,
    roles: [],
    errors: null,
    roleNames: [],
    count: 0,
    projects: [],
    color: ["pink", "indigo", "light-blue", "teal", "light-green", "yellow"]
  }),
  computed: {
    darkMode() {
      const theme = store.getters.currentTheme;
      if (theme === "dark") {
        return true;
      }
      return false;
    }
  },
  async created() {
    this.members = this.initmembers;
    this.team = this.initteam;
    this.logoSrc = this.initlogoSrc;
    this.owned = this.initowned;
    this.count = this.members.length;
    this.projects = this.initprojects;
    // All roles in db
    this.roles = await this.pullRoleData();
    for (let i = 0; i < this.roles.length; i++) {
      this.roleNames[i] = this.roles[i].role;
    }
  },
  methods: {
    uploaded(val) {
      this.team.profilePicUrl = val.url;
      this.logoSrc = this.team.profilePicUrl;
      console.log(val);
    },
    cancel() {
      this.members = this.initmembers;
      this.team = this.initteam;
      this.logoSrc = this.initlogoSrc;
      this.owned = this.initowned;
      this.count = this.members.length;

      this.editing = false;
      this.showMembers = !this.showMembers;
      this.$emit("teamUpdated");
    },
    async confirmationReceived(toDelete) {
      if (toDelete === "true") {
        console.log("Deleting...");

        console.log("removing members");
        for (let i = 0; i < this.members.length; i++) {
          const done = await feathersClient
            .service("members")
            .remove(this.members[i].id);
          console.log(done);
        }

        console.log("removing Projects");
        for (let i = 0; i < this.projects.length; i++) {
          console.log("removing Backlogs");
          const raw = await feathersClient.service("backlog-items").find({
            query: {
              projectid: this.projects[i].id
            }
          });
          for (let j = 0; j < raw.data.length; j++) {
            const done1 = await feathersClient
              .service("backlog-items")
              .remove(raw.data[j].id);
            console.log(done1);
          }

          console.log("removing sprints");
          const raw2 = await feathersClient.service("sprints").find({
            query: {
              projectid: this.projects[i].id
            }
          });
          for (let j = 0; j < raw2.data.length; j++) {
            const raw3 = await feathersClient.service("tasks").find({
              query: {
                projectid: raw2.data[i]
              }
            });
            console.log(raw3.data[i]);
          }
          // await feathersClient.service("projects").remove(this.projects[i].id);
        }
        //await feathersClient.service("teams").remove(this.team.id);
        //

        router.push("/teams");
        this.deletingTeam = false;
      } else {
        this.deletingTeam = false;
      }
    },
    deleteTeam() {
      this.deletingTeam = true;
    },
    // Remove member from team
    removeMember(i) {
      this.members.splice(i, 1);
      this.count--;
    },
    // Push to member profile
    goToProfile(link, id) {
      router.push(link + id);
    },
    setupEditingEnv() {
      for (let i = 0; i < this.members.length; i++) {
        this.members[i].color = this.randomColor();
      }
      this.editing = true;
      this.showMembers = !this.showMembers;
    },
    async updateChanges() {
      for (let i = 0; i < this.members.length; i++) {
        if (
          this.members[i].role === "" ||
          this.members[i].role === null ||
          this.members[i].role === undefined
        ) {
          this.errors = "All members need roles";
          break;
        } else {
          this.errors = null;
        }
      }
      if (this.errors != null) {
        return;
      } else {
        for (let i = 0; i < this.members.length; i++) {
          for (let j = 0; j < this.roles.length; j++) {
            if (this.members[i].role === this.roles[j].role) {
              this.members[i].roleid = this.roles[j].id;
            }
          }
        }
        const rawTeam = await feathersClient.service("teams").find({
          query: {
            id: this.team.id,
            $select: ["name", "description", "profilePicUrl"]
          }
        });
        const oldTeamState = rawTeam.data[0];
        if (
          this.team.name != oldTeamState.name ||
          this.team.description != oldTeamState.description ||
          this.team.profilePicUrl != oldTeamState.profilePicUrl
        ) {
          await feathersClient.service("teams").patch(this.team.id, {
            name: this.team.name,
            description: this.team.description,
            profilePicUrl: this.team.profilePicUrl
          });
        }

        for (let i = 0; i < this.members.length; i++) {
          this.members[i].teamid = this.team.id;
          const raw = await feathersClient.service("users").find({
            query: {
              email: this.members[i].email,
              $select: ["id"]
            }
          });
          this.members[i].userid = raw.data[0].id;

          const raw2 = await feathersClient.service("members").find({
            query: {
              userid: this.members[i].userid,
              teamid: this.team.id,
              $select: ["id"]
            }
          });
          try {
            this.members[i].id = raw2.data[0].id;
          } catch (err) {
            this.members[i].id = undefined;
          }
          if (
            this.members[i].id === null ||
            this.members[i].id === undefined ||
            this.members[i].id === ""
          ) {
            const res = await feathersClient.service("members").create({
              userid: this.members[i].userid,
              teamid: this.team.id,
              roleid: this.members[i].roleid,
              fav: false
            });
            this.members[i].id = res.id;
          } else {
            await feathersClient.service("members").patch(this.members[i].id, {
              userid: this.members[i].userid,
              teamid: this.team.id,
              roleid: this.members[i].roleid
            });
          }
        }
        const raw3 = await feathersClient.service("members").find({
          query: {
            teamid: this.team.id,
            $select: ["id", "userid"]
          }
        });
        const teamInDb = raw3.data;
        for (let i = 0; i < teamInDb.length; i++) {
          let found = false;
          for (let j = 0; j < this.members.length; j++) {
            if (teamInDb[i].id === this.members[j].id) {
              found = true;
              break;
            }
          }
          if (!found) {
            await feathersClient.service("members").remove(teamInDb[i].id);
          }
        }

        this.$emit("teamUpdated");
        this.editing = false;
        this.showMembers = !this.showMembers;
      }
    },
    randomColor() {
      const color = this.color[Math.floor(Math.random() * this.color.length)];
      color.concat(" darken-2");
      return color;
    },
    async addMember() {
      this.count = this.members.length;
      this.email = this.email.replace(/ /g, "").toLowerCase();
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(this.email)) {
        this.errors = "Invalid email";
      } else {
        let memberAlreadyInArray = false;
        for (let i = 0; i < this.members.length; i++) {
          if (this.email == this.members[i].email) {
            memberAlreadyInArray = true;
          }
        }
        if (!memberAlreadyInArray) {
          let memberExists = false;
          this.errors = `Checking if ${this.email} is a user...`;
          let memberUserId = await this.getUserId(this.email);
          if (memberUserId === null || memberUserId === undefined) {
            this.errors = `${this.email} is not a user`;
            memberExists = false;
          } else {
            this.errors = null;
            memberExists = true;
          }
          if (memberExists) {
            this.members.push({
              id: this.count,
              email: this.email,
              color: this.randomColor()
            });
            this.count += 1;
            this.email = "";
          }
        } else {
          this.errors = `${this.email} has already been added`;
        }
      }
    },
    async getUserId(memberEmail) {
      try {
        const raw = await feathersClient.service("users").find({
          query: {
            email: memberEmail,
            $select: ["id"]
          }
        });
        return raw.data[0].id;
      } catch (err) {
        this.errors = `${memberEmail} is not a user`;
      }
    },
    // Return ID's and Names of roles in DB
    async pullRoleData() {
      const rawData = await feathersClient.service("roles").find({
        query: {
          $select: ["id", "role"]
        }
      });
      return [...rawData.data];
    }
  }
};
</script>
