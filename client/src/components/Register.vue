<template>
  <form @submit.prevent="register">
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <input type="password" v-model="confirmPassword" placeholder="Confirm password" />
    <button type="submit">Register</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    async register() {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
        }),
      });
      const data = await response.json();
      localStorage.setItem('token', data.token);
      this.$router.push('/');
    },
  },
};
</script>
