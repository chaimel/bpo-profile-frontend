<template>
	<div class="guide">
		<Banner />

		<!-- Part 1: the business -->
		<Goal />
		<Audiences />
		<Model />
		<Analytics />
		<Growth />
		<Roadmap />
		<Risks />

		<!-- Part 2: the demo -->
		<DemoIntro />
		<Facts />
		<Areas />
		<Tours />
		<States />
		<Cta />
	</div>
</template>

<script setup lang="ts">
import Analytics from './Analytics.vue'
import Areas from './areas/Index.vue'
import Audiences from './Audiences.vue'
import Banner from './Banner.vue'
import Cta from './Cta.vue'
import DemoIntro from './DemoIntro.vue'
import Facts from './Facts.vue'
import Goal from './Goal.vue'
import Growth from './Growth.vue'
import Model from './Model.vue'
import Risks from './Risks.vue'
import Roadmap from './Roadmap.vue'
import States from './States.vue'
import Tours from './tours/Index.vue'
</script>
