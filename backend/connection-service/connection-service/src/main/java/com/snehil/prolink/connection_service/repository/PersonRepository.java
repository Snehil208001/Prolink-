package com.snehil.prolink.connection_service.repository;

import com.snehil.prolink.connection_service.entity.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param; // <-- Add this import

import java.util.List;
import java.util.Optional;

public interface PersonRepository extends Neo4jRepository<Person,Long> {

    Optional<Person> getByName(String name);

    @Query("MATCH (personA:Person) -[:CONNECTED_TO]- (personB:Person) " +
            "WHERE personA.userId = $userId " +
            "RETURN personB")
    List<Person> getFirstDegreeConnection(@Param("userId") Long userId);

    @Query("MERGE (a:Person {userId: $userId1}) " +
            "MERGE (b:Person {userId: $userId2}) " +
            "MERGE (a)-[:CONNECTED_TO]-(b)")
    void createConnection(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("MATCH (a:Person {userId: $userId1})-[r:CONNECTED_TO]-(b:Person {userId: $userId2}) " +
            "DELETE r")
    void deleteConnection(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("MATCH (a:Person {userId: $userId1})-[r:CONNECTED_TO]-(b:Person {userId: $userId2}) " +
            "RETURN count(r) AS cnt")
    List<Long> countConnection(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

}