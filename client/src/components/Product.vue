<template>
  <div>
    <h2>{{ product.name }}</h2>
    <p>{{ product.description }}</p>
    <p>{{ product.price }} USD</p>
    <button @click="addToCart">Add to cart</button>
  </div>
</template>

<script>
export default {
  props: ['product'],
  methods: {
    async addToCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/cart/${this.product._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      this.$store.commit('setCart', data);
    },
  },
};
</script>
