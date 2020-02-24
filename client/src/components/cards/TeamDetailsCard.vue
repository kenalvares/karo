<!-- Team Details Card-->
<!-- Displays detailed team data in a card -->
<template>
  <section>
    <v-hover v-slot:default="{ hover }">
      <v-card
        :elevation="hover ? 16 : 2"
        class="px-0 py-2"
        style="overflow:hidden;"
        ><v-expand-transition>
          <div
            v-if="hover"
            class="d-flex transition-ease-in-out primary v-card--reveal display-4 white--text"
          >
            {{ team.name.toUpperCase() }}
          </div>
        </v-expand-transition>
        <v-row>
          <v-col cols="2">
            <v-flex class="pa-5">
              <!-- Team Logo -->
              <v-avatar size="164">
                <v-img :src="logoSrc" />
              </v-avatar>
            </v-flex>
          </v-col>
          <v-col cols="10" class="flex-column">
            <!-- Team Name -->
            <v-card-title v-if="!editing">{{ team.name }}</v-card-title>
            <v-text-field
              v-if="editing"
              label="Team Name"
              v-model="team.name"
              style="width: 80%;"
            />
            <!-- Team Description -->
            <v-card-subtitle v-if="!editing">
              {{ team.description }}
            </v-card-subtitle>
            <v-textarea
              v-if="editing"
              label="Team Description"
              v-model="team.description"
              style="width: 80%;"
            />
          </v-col>
        </v-row>

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
              <v-icon left> check </v-icon>Done
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

        <v-expand-transition v-if="!editing">
          <div>
            <v-list-item
              v-show="showMembers"
              v-for="member in members"
              :key="member.userid"
              class="border-list-item"
            >
              <!-- Member name -->
              <span class="member-name">{{ member.name }}</span>
              <!-- Member email -->
              <span class="member-email">{{ member.email }}</span>
              <v-spacer />
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
            </v-list-item>
          </div>
        </v-expand-transition>
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
  </section>
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
.member-name {
  font-size: 1.2rem;
  font-weight: 400;
}

.member-email {
  font-size: 0.8rem;
  text-transform: uppercase;
  border-radius: 0.2rem;
  letter-spacing: 0.1rem;
  padding: 0.1rem 0.3rem;
  margin: 0.1rem 0.5rem;
  background-color: #303030;
}

.border-list-item {
  border: 1px solid #303030;
  border-left-width: 0;
  border-right-width: 0;
  border-bottom-width: 0;
}
.v-card--reveal {
  padding-top: 10%;
  align-items: center;
  bottom: -50%;
  justify-content: flex-end;
  opacity: 0.1;
  position: absolute;
  height: 190%;
  width: 100%;
  font-weight: 900;
}
</style>

<script>
/*eslint-disable no-console*/
import router from "@/router/index";
import feathersClient from "@/feathers-client";
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
    initowned: Boolean
  },
  data: () => ({
    showMembers: false,
    editing: false,
    email: "",
    members: [],
    team: {},
    logoSrc: "",
    owned: null,
    roles: [],
    errors: null,
    roleNames: [],
    color: ["pink", "indigo", "light-blue", "teal", "light-green", "yellow"]
  }),
  async created() {
    this.members = this.initmembers;
    this.team = this.initteam;
    this.logoSrc = this.initlogoSrc;
    this.owned = this.initowned;
    // All roles in db
    this.roles = await this.pullRoleData();
    for (let i = 0; i < this.roles.length; i++) {
      this.roleNames[i] = this.roles[i].role;
    }
  },
  methods: {
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
          delete this.members[i].color;
          for (let j = 0; j < this.roles.length; j++) {
            if (this.members[i].role === this.roles[j].role) {
              this.members[i].roleid = this.roles[j].id;
            }
          }
        }
        if (
          this.team.name != this.initteam.name ||
          this.team.description != this.initteam.description
        ) {
          await feathersClient.service("teams").patch(this.team.id, {
            name: this.team.name,
            description: this.team.description
          });
        }

        for (let i = 0; i < this.members.length; i++) {
          this.members[i].teamid = this.team.id;
          const raw = await feathersClient.service("users").find({
            email: this.members[i].email,
            $select: ["id"]
          });
          console.log(raw);
          /*await feathersClient.service("members").patch(this.members[i].id, {
            teamid: this.members[i].teamid,
            userid: this.members[i].userid,
            roleid: this.members[i].roleid
          });*/
        }
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
