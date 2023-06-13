<script lang="ts">
  import { page } from "$app/stores";
</script>

<main>
  <h1>{$page.status}: {$page.error?.message}</h1>

  <div class="link-container">
    <span>Lost?</span>

    <a href="/">Go Back Home!</a>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
</style>
