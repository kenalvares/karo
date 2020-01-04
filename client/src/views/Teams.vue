<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12">
        <CreateTeamDialog />
        <v-btn-toggle
          v-model="teamFilter"
          tile
          :color="filterColor"
          group
          mandatory
        >
          <v-btn value="all" @click="filterTeams('all')">
            All
          </v-btn>
          <v-btn value="owned" @click="filterTeams('owned')">
            Owned
          </v-btn>
          <v-btn value="fav" @click="filterTeams('fav')">
            Fav
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="team in selectedTeams" :key="team.id" cols="12" sm="4">
        <TeamCard :team="team" />
      </v-col>
      <EmptyCard
        :toShow="emptyTeamArray"
        msg="
          It looks like there's nothing here right now. You can click the button
          above to add a new team."
      />
    </v-row>
  </v-container>
</template>

<script>
import TeamCard from "@/components/cards/TeamCard";
import CreateTeamDialog from "@/components/sheets/CreateTeamDialog";
import EmptyCard from "@/components/cards/EmptyCard";

export default {
  name: "teams",
  data: () => ({
    teamFilter: "all",
    filterColor: "purple",
    teams: [
      {
        id: "1",
        name: "MedHeads",
        description:
          "Medical students, practicing professionals and engineers - building modern medical solutions",
        avatar: "https://picsum.photos/300/300?random=6",
        owned: true,
        fav: true
      },
      {
        id: "2",
        name: "Youth4You",
        description:
          "A group of law students who fight for the pressing concerns facing our nation's youth",
        avatar: "https://picsum.photos/300/300?random=7",
        owned: false,
        fav: false
      },
      {
        id: "3",
        name: "20th Century Wolf",
        description:
          "Team to manage movie production - financing, scripting, casting, etc",
        avatar: "https://picsum.photos/300/300?random=8",
        owned: false,
        fav: false
      },
      {
        id: "4",
        name: "Goa Police",
        description: "Online hub for Goa Police Force to collaborate and plan",
        avatar: "https://picsum.photos/300/300?random=9",
        owned: true,
        fav: false
      },
      {
        id: "5",
        name: "Group #5",
        description:
          "BCA students working on big projects, from a little state",
        avatar: "https://picsum.photos/300/300?random=10",
        owned: true,
        fav: true
      }
    ]
  }),
  components: {
    TeamCard,
    CreateTeamDialog,
    EmptyCard
  },
  computed: {
    selectedTeams() {
      if (this.teamFilter === "fav") {
        return this.teams.filter(function(team) {
          return team.fav;
        });
      } else if (this.teamFilter === "owned") {
        return this.teams.filter(function(team) {
          return team.owned;
        });
      } else {
        return this.teams;
      }
    },
    emptyTeamArray() {
      if (this.selectedTeams.length < 1) {
        return true;
      }
      return false;
    }
  },
  methods: {
    filterTeams(type) {
      if (type === "all") {
        this.filterColor = "purple";
      } else if (type === "fav") {
        this.filterColor = "yellow";
      } else if (type === "owned") {
        this.filterColor = "success";
      } else {
        this.filterColor = "grey";
      }
      this.filterColor.concat(" accent-4");
    }
  }
};
</script>
