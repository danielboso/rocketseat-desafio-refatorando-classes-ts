import React, { Component, useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood/index';
import { FoodsContainer } from './styles';
import { IFood } from '../../types/Food';

export const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    api.get('/foods').then(response => setFoods(response.data));
  }, [])

  const handleAddFood = async (food: IFood) => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: IFood) => {

    try {

      if(!editingFood) {
        throw new Error("Error updating food");
      }

      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food });

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    api.delete(`/foods/${id}`).then(() => {
      setFoods(foods.filter(food => food.id !== id));
    });
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  }

  const handleEditFood = (food: IFood) => {
    setEditingFood(food);
    setIsEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood isOpen={isModalOpen} setIsOpen={toggleModal} handleAddFood={handleAddFood} />
      <ModalEditFood isOpen={isEditModalOpen} setIsOpen={toggleEditModal} editingFood={editingFood!} handleUpdateFood={handleUpdateFood} />

      <FoodsContainer data-testid="foods-list">
        {foods && foods.map(food => (
          <Food key={food.id} food={food} handleDelete={handleDeleteFood} handleEditFood={handleEditFood} />
        ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
